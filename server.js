const express = require("express");
const ejs = require("ejs");

const PORT = 3000;
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});