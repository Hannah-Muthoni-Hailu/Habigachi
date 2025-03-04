const express = require("express");
const ejs = require("ejs");
const routes = require('./routes/main');

const PORT = 3000;
const app = express();

// Set up ejs
app.set("view engine", "ejs");

// Obtain the routes
app.use('/', routes);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});