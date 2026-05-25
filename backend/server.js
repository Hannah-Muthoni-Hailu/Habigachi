const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { body, validationResult, header } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function startServer() {
    try {
        await client.connect();
        db = client.db('habigachi');
        console.log('Connected successfully to MongoDB');

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

app.post('/signup', 
    body('username').notEmpty().withMessage('Please enter a username').isLength({ min: 5 }).withMessage('Username must have more than 5 characters'),
    body('email').notEmpty().withMessage('Please enter an email address').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Please enter a password').isLength({ min: 5 }).withMessage('Password must have more than 5 characters'),
    async (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            try {
                let existing_users = await db.collection('users').find({ email: req.body.email }).toArray();

                if (existing_users.length === 0) {
                    const dbResult = await db.collection('users').insertOne({
                        'username': req.body.username,
                        'email': req.body.email,
                        'password': req.body.password
                    });

                    // Call retreive habit
                    const result = await fetch("http://localhost:3000/retreiveHabits",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            'email': req.body.email
                        })
                    });

                    const response = await result.json();

                    if (!result.ok) {
                        res.status(500).json({ error: response.errors })
                    } else {
                        res.status(200).json({ email: response.email, incomplete: response.incomplete, complete: response.complete });
                    }
                } else {
                    res.status(500).json({ errors: "The email already exists. Please provide a different one or log in" })
                }
                
            } catch (error) {
                res.status(500).json({ errors: [error.message] });
            }
        } else {
            let error_list = [];
            results_arr = result.array();

            for (let i = 0; i < results_arr.length; i++) {
                error_list.push(results_arr[i]["msg"])
            }

            res.status(400).json({ errors: error_list })
        };
});

app.post('/login',
    body('email').notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty').isLength({ min: 5 }).withMessage('Please enter a valid password'),
    async (req, res) => {
        const results = validationResult(req)

        if (results.isEmpty()) {
            let existing_users = await db.collection('users').find({ email: req.body.email, password: req.body.password }).toArray();

            if (existing_users.length === 1) {
                // Call retreive habit
                    const result = await fetch("http://localhost:3000/retreiveHabits",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            'email': req.body.email
                        })
                    });

                    const response = await result.json();

                    if (!result.ok) {
                        res.status(500).json({ error: response.errors })
                    } else {
                        res.status(200).json({ email: response.email, incomplete: response.incomplete, complete: response.complete });
                    }
            } else {
                res.status(500).json({ errors: ['Invalid email or password'] });
            }
        } else {
            let error_list = [];
            results_arr = results.array();

            for (let i = 0; i < results_arr.length; i++) {
                error_list.push(results_arr[i]["msg"])
            }

            res.status(400).json({ errors: error_list })
        }
    }
)

app.post('/newHabit', 
    body('email'),
    body('name').notEmpty().withMessage('Habit must have a name').isLength({ min: 5, max: 100 }).withMessage('Habit name must have a minimum of 5 characters and a maximum of 100'),
    body('goal').notEmpty().withMessage('You must set a completion goal').isNumeric(),
    async (req, res) => {
        const results = validationResult(req)

        if (results.isEmpty) {
            try {
                let existing_habit = await db.collection('habits').find({ email: req.body.email, name: req.body.name }).toArray()
                let todaysDate = new Date()

                if (existing_habit.length === 0) {
                    const dbResult = await db.collection('habits').insertOne({
                            'email': req.body.email,
                            'name': req.body.name,
                            'goal': req.body.goal,
                            'creationDate': todaysDate,
                            'nextDate': todaysDate,
                            'completedDays': 0,
                        });

                    // Call retreive habit
                    const result = await fetch("http://localhost:3000/retreiveHabits",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            'email': req.body.email
                        })
                    });

                    const response = await result.json();

                    if (!result.ok) {
                        res.status(500).json({ error: response.errors })
                    } else {
                        res.status(200).json({ email: response.email, incomplete: response.incomplete, complete: response.complete });
                    }
                } else {
                    res.status(500).json({ errors: ["A habit with a similar name already exists. Please pick a new one!"] });
                }
            } catch (error) {
                res.status(500).json({ errors: [error.message] });
            }
        } else {
            let error_list = [];
            results_arr = result.array();

            for (let i = 0; i < results_arr.length; i++) {
                error_list.push(results_arr[i]["msg"])
            }

            res.status(400).json({ errors: error_list })
        };
});

app.post('/markHabit', async (req, res) => {
    try {
        let existing_habit = await db.collection('habits').find({ email: req.body.email, name: req.body.name }).toArray();
        const newCompletedDays = existing_habit[0]['completedDays'] + 1
        
        const tomorrow = new Date(Date.now() + 86400000);

        db.collection('habits').updateOne({ email: req.body.email, name: req.body.name }, { $set: { completedDays: newCompletedDays, nextDate: tomorrow } });

        // Call retreive habit
        const result = await fetch("http://localhost:3000/retreiveHabits",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                'email': req.body.email
            })
        });

        const response = await result.json();

        if (!result.ok) {
            res.status(500).json({ error: response.errors })
        } else {
            res.status(200).json({ email: response.email, incomplete: response.incomplete, complete: response.complete });
        }
    } catch (error) {
        res.status(400).json({ errors: [error.message] });
    }
    
})

app.post('/retreiveHabits', async (req, res) => {
    try {
        let habits = await db.collection('habits').find({ email: req.body.email }).toArray();

        let completed = [];
        let incomplete = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < habits.length; i++) {
            const target = new Date(habits[i]['nextDate']);
            target.setHours(0, 0, 0, 0);

            if (target <= today) {
                incomplete.push(habits[i]);
            } else {
                completed.push(habits[i]);
            }
        }
        res.status(200).json({ complete: completed, incomplete: incomplete, email: req.body.email });
    } catch (error) {
        res.status(500).json({ errors: [error.message] });
    }
})

startServer();