const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const JWT_KEY = process.env.JWT_KEY;

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    // Ensuring that the email provided is unique
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // If user found meaning if array of users is not empty
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "User with provided email address already exists in the database"
                })
            } else {
                // Encrypting the password
                bcrypt.hash(req.body.password, 10, (err, hash) => {
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
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
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
});

// Loging users in
router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                } else if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                    },
                        JWT_KEY,
                        {
                            expiresIn: "1h"
                        },
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token,
                    });
                } else {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

// Deleting users
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