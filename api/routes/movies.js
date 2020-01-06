const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movie = require("../models/movie");
const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => {
    Movie.find()
        // fetching only info that is useful
        .select("name genre _id")
        .exec()
        .then(docs => {
            const response = {
                // addint the length of fetced array
                count: docs.length,
                movies: docs.map(doc => {
                    return {
                        name: doc.name,
                        genre: doc.genre,
                        _id: doc._id,
                        // request for adding more info about the movie
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/movies/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post("/", checkAuth, (req, res, next) => {

    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        genre: req.body.genre,
    })
    movie.save().then(result => {
        console.log(result);

        res.status(201).json({
            message: "Created product successfully",
            createdMovie: {
                name: result.name,
                genre: result.genre,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/movies/" + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});

router.get("/:movieId", (req, res, next) => {
    const id = req.params.movieId;
    Movie.findById(id)
        .select("name genre _id")
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
            if (doc) {
                res.status(200).json({
                    movie: doc,
                    request: {
                        type: "GET",
                        description: "Get all movies",
                        url: "http://localhost:3000/movies"
                    }
                });
            }
            else {
                res.status(404).json({ message: "No valid entry found for provided ID" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
    // res.status(200).json({
    //     message: "Movie id is " + id,
    //     id: id,
    // });
});

router.post("/:movieId", (req, res, next) => {
    const id = req.params.movieId;
    res.status(201).json({
        message: "Movie id is " + id,
        id: id,
    });
});

router.patch("/:movieId", checkAuth, (req, res, next) => {
    const id = req.params.movieId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Movie.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    // res.status(200).json({
    //     message: "Updated movie: " + id,
    //     id: id,
    // });
});

router.delete("/:movieId", checkAuth, (req, res, next) => {
    const id = req.params.movieId;
    Movie.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;