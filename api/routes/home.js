const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');


// Home
router.get("/", forwardAuthenticated, (req, res) => res.render("home"));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        email: req.user.email,
    })
);

module.exports = router