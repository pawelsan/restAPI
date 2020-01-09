const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Leftovers from token authentication option
// const jwt = require("jsonwebtoken");
// require('dotenv').config();
// const JWT_KEY = process.env.JWT_KEY;

const User = require("../models/user");


// Signup Page

router.get("/signup", (req, res) => res.render("signup"));

//  Signup Handle

router.post("/signup", (req, res, next) => {
    // Form validation
    const { email, password, password2 } = req.body;
    const validEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    let errors = [];

    if (!email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (!email.match(validEmail)) {
        errors.push({ msg: 'Please provide a valid email' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters long' });
    }

    // If the data does not pass validation, rerender the signup page
    if (errors.length > 0) {
        res.render('signup', {
            errors,
            email,
            password,
            password2
        });

    } else {
        // Ensuring that the email provided is unique
        User.find({ email })
            .exec()
            .then(user => {
                // If user found meaning if array of users is not empty
                if (user.length >= 1) {
                    errors.push({ msg: 'User with provided email address already exists in the database. Try logging in.' });
                    return res.status(409).render('signup', {
                        errors,
                        email,
                        password,
                        password2
                    });

                } else {
                    // Encrypting the password
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                            });
                            user
                                .save()
                                .then(result => {
                                    req.flash("success_msg", "You are now registered and can log in");
                                    res.status(201).redirect("/users/login");
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    })
                                });
                        }
                    });
                }
            })
    }
});

// Login Page

router.get("/login", (req, res) => res.render("login"));

// Login Handle

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // Leftovers from token authentication option considered previously
    // User.find({ email: req.body.email })
    //     .exec()
    //     .then(user => {
    //         if (user.length < 1) {
    //             return res.status(401).json({
    //                 message: "Auth failed"
    //             })
    //         }
    //         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    //             if (err) {
    //                 return res.status(401).json({
    //                     message: "Auth failed"
    //                 })
    //             } else if (result) {
    //                 // creating token with jsonwebtoken
    //                 const token = jwt.sign({
    //                     email: user[0].email,
    //                     userId: user[0]._id,
    //                 },
    //                     JWT_KEY,
    //                     {
    //                         expiresIn: "1h"
    //                     },
    //                 );
    //                 return res.status(200).json({
    //                     message: "Auth successful",
    //                     token,
    //                 });
    //             } else {
    //                 return res.status(401).json({
    //                     message: "Auth failed"
    //                 })
    //             }
    //         })
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             error: err
    //         })
    //     });
})

// Logout handle
router.get('/logout', (req, res) => {
    // Logout function from passport middleware
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

// Deleting users - not implemented on the frontend
router.delete("/:userId", (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;