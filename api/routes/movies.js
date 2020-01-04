const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movie = require("../models/movie");

router.get("/", (req, res, next) => {
    Movie.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post("/", (req, res, next) => {

    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        genre: req.body.genre,
    })
    movie.save().then(result => {
        console.log(result);

        res.status(201).json({
            message: "Handling POST requests to /movies",
            createdMovie: result
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
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
            if (doc) {
                res.status(200).json(doc);
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

router.patch("/:movieId", (req, res, next) => {
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

router.delete("/:movieId", (req, res, next) => {
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
    // const id = req.params.movieId;
    // res.status(200).json({
    //     message: "Deleted movie: " + id,
    //     id: id,
    // });
});

module.exports = router;