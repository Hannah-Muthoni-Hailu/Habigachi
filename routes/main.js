const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("auth", { type: "Signup" });
});

router.get("/login", (req, res) => {
    res.render("auth", { type: "Login" });
});

module.exports = router;