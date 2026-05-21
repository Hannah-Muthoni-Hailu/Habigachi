const express = require("express");
const routes = require('./routes/main');
const path = require('path');

const PORT = 3000;
const app = express();

// Set up ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Obtain the routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});