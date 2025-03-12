const express = require("express");
const router = express.Router();
const { userValidationRules, validate, userLoginValidationRules } = require("../validations/user.validation");
const sqlite3 = require('sqlite3').verbose();
let current_user;
const today = new Date();

// Open db connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected to database");
})

// Create user's table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL)`);

db.run(`CREATE TABLE IF NOT EXISTS date (
    today TEXT DEFAULT "0000/00/00")`);

// Create user's table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS habits (
    habit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    num_completed INTEGER DEFAULT 0,
    done INTEGER DEFAULT 0,
    user INTEGER,
    FOREIGN KEY (user) REFERENCES users (id))`);

// Update the done habits every new day
db.get("SELECT today FROM date", (err, last_update) => {
    if (err) console.log(err.message);
    
    // Check if no update has ever been done previously or if the last update wasn't today
    if (!last_update || last_update.today != today.toLocaleDateString()) {
        // Update done variables in habits
        db.run("UPDATE habits SET done = 0", (err) => {
            if (err) console.log(err.message);
        })
        // Update last update to today
        if (!last_update){
            db.run("INSERT INTO date (today) VALUES (?)", [today.toLocaleDateString()], (err) => {
                if (err) console.log(err.message);
            })
        } else {
            db.run("UPDATE date SET today = ?", [today.toLocaleDateString()], (err) => {
                if (err) console.log(err.message);
            })
        }
    }
})

router.get("/", (req, res) => {
    if (current_user) {
        db.all("SELECT habit_id, name, color, done FROM habits WHERE user = ? AND done = FALSE", [current_user], (err, habit) => {
            if (err) return res.status(400).send(err.message);
            if (habit) {
                res.render("index", { habits : habit });
            }
            else {
                res.render("index", { habits : [] });
            }
        });
    } else {
        res.render("index", { habits : [] });
    }
});

router.get("/signup", (req, res) => {
    res.render("auth", { type: "Signup", endpoint: "/signup" });
});

router.post("/signup", userValidationRules(), validate, (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if the username or email already exists in db
    db.run('INSERT INTO users(username, email, password) VALUES(?, ?, ?)', [username, email, password], (err) => {
        if (err) {
            if (err.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username") return res.status(400).send("Username already in use! Create a new one or log in");
            if (err.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email") return res.status(400).send("Email already in use! Please log in");
            return res.status(400).send(err.message);
        }
        // Redirect to login
        res.redirect('/login');
    });
});

router.get("/login", (req, res) => {
    res.render("auth", { type: "Login", endpoint: "/login" });
});

router.post("/login", userLoginValidationRules(), validate, (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(400).send(err.message);
        if (!user) return res.status(400).send("User not found please signup")

        if (user.password == password) {
            current_user = user.id;
            res.redirect('/');
        }
        else {
            return res.status(400).send("Wrong password")
        }
    })
});

router.get("/newhabit", (req, res) => {
    if (!current_user) {
        res.redirect('/login')
    }
    else {
        res.render("newHabit");   
    }
});

router.post("/newhabit", (req, res) => {
    const { name, color } = req.body;

    db.run("INSERT INTO habits(name, color, user) VALUES (?, ?, ?)", [name, color, current_user], (err) => {
        if (err) return res.status(400).send(err.message);
        res.redirect("/")
    })
});

router.post("/update_habit", (req, res) => {
    const { habit, action } = req.body;
    
    if (action == "delete"){
        db.run("DELETE FROM habits WHERE habit_id = ?", [habit], (err) => {
            if (err) return res.status(400).send(err.message);
        })
    } else {
        db.run("UPDATE habits SET done = TRUE WHERE habit_id = ?", [habit], (err) => {
            if (err) return res.status(400).send(err.message);
        })
    }
    res.redirect("/");
})

module.exports = router;