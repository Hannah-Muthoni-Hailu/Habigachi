const express = require("express");
const ejs = require("ejs");
const routes = require('./routes/main');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

// Set up ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Obtain the routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});