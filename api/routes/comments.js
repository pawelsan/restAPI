const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Movie = require("../models/movie")
const checkAuth = require("../middleware/check-auth");

// Handle incomming GET requests to /comments
router.get("/", (req, res, next) => {
    Comment
        .find()
        .select("movie content _id")
        // line below used for linking with the movie module
        .populate("movie", "name")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                comments: docs.map(doc => {
                    return {
                        movie: doc.movie,
                        commentId: doc._id,
                        content: doc.content,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/comments/" + doc._id
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

router.post("/", checkAuth, (req, res, next) => {
    // Solution implemented to avoid commenting movies that do not exist in the database
    Movie.findById(req.body.movieId)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const comment = new Comment({
                _id: new mongoose.Types.ObjectId(),
                movieId: req.body.movieId,
                content: req.body.content,
            });
            return comment
                .save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Comment saved",
                createdComment: {
                    _id: result._id,
                    movieId: result.movie,
                    content: result.content,
                },
                request: {
                    type: "GET",
                    rl: "http://localhost:3000/comments/" + result._id
                }
            })
        })
        .catch(err => {
            console.log(500).json({
                error: err
            });
        });
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
                    url: "http://localhost:3000/comments",
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// router.post("/:commentId", (req, res, next) => {
//     const id = req.params.commentId;
//     res.status(201).json({
//         message: "Comment id is " + id,
//         id: id,
//     });
// });


router.delete("/:commentId", checkAuth, (req, res, next) => {
    const id = req.params.commentId;
    Comment.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Comment deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/comments",
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