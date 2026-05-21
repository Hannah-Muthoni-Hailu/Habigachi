const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { body, validationResult } = require('express-validator');
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
                    res.status(200).json({ message: 'New user created successfully!' });
                } else {
                    res.status(500).json({ error: "The email already exists. Please provide a different one or log in" })
                }
                
            } catch (error) {
                res.status(500).json({ error: [error.message] });
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
                res.status(200).json({ message: 'User successfully logged in!' });
            } else {
                res.status(500).json({ error: ['Invalid email or password'] });
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

startServer();