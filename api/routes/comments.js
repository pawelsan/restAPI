const express = require("express");
const router = express.Router();
const request = require("request");
const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Movie = require("../models/movie")

// Handle incomming GET requests to /comments
router.get("/", (req, res, next) => {
    Comment
        .find()
        .select("movie content _id")
        // line below used for linking with the movie module
        .populate("movie", "title")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                comments: docs.map(doc => {
                    return {
                        movie: doc.movie,
                        title: doc.title,
                        commentId: doc._id,
                        content: doc.content,
                        request: {
                            type: "GET",
                            url: "https://movieapi2020.herokuapp.com/comments/" + doc._id
                        }
                    }
                }),

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post("/",
    (req, res, next) => {
        console.dir(req.body)
        // Solution implemented to avoid commenting movies that do not exist in the database
        Movie.findById(req.body.movieId)
            .exec()
            .catch(err => {
                console.log(500)
            })
            .then(movie => {
                if (!movie) {
                    return res.status(404).render('post-status', {
                        message: "Movie not found"
                    })
                }
                else {
                    const comment = new Comment({
                        _id: new mongoose.Types.ObjectId(),
                        movie: req.body.movieId,
                        content: req.body.content,
                    });
                    comment.save().then(result => {
                        res.status(201).render('post-status', {
                            message: `Created comment: "${result.content}". With relation to ${movie.title} (movie ID: ${result.movie}). Comment ID ${result._id}. You can request it with "GET" from: https://movieapi2020.herokuapp.com/movies/${result._id}`
                        })
                    }).catch(err => {
                        console.log(500).json({
                            error: err
                        });
                    });
                }
            })

    });

router.get("/:commentId", (req, res, next) => {
    Comment.findById(req.params.commentId)
        .populate("movie")
        .exec()
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }
            res.status(200).json({
                comment,
                request: {
                    type: "GET",
                    url: "https://movieapi2020.herokuapp.com/comments",
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// Deleting - not implemented on the frontend
router.delete("/:commentId",
    (req, res, next) => {
        const id = req.params.commentId;
        Comment.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Comment deleted",
                    request: {
                        type: "POST",
                        url: "https://movieapi2020.herokuapp.com/comments",
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    });

module.exports = router;