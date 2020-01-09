const express = require("express");
const router = express.Router();
const request = require("request");
const mongoose = require("mongoose");
const Movie = require("../models/movie");
require('dotenv').config();
const apikey = process.env.APIKEY;

router.get("/", (req, res, next) => {
    Movie.find()
        // fetching only info that is useful
        .select("title year _id")
        .exec()
        .then(docs => {
            const response = {
                // addint the length of fetced array
                count: docs.length,
                movies: docs.map(doc => {
                    return {
                        title: doc.title,
                        year: doc.year,
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

router.post("/",
    (req, res, next) => {
        // options object for request to external API
        const options = {
            url: `http://www.omdbapi.com/?apikey=${apikey}&plot=full&t=`,
            method: "GET",
            qs: {
                t: req.body.title,
            }
        }

        request(options, (error, response, body) => {
            const data = JSON.parse(body)
            // checking if searched movie exists in the external API
            if (data.Response === "False") {
                return res.status(404).render('post-status', {
                    message: data.Error
                })
            }
            // if data was fetched, although the movie title found differs from the request
            else if (req.body.title !== data.Title) {
                return res.status(303).render('post-status', {
                    message: `Found a movie with a similar title: ${data.Title}. Please use this exact title (case sensitive).`
                })
            }
            else {
                Movie.find({ title: data.Title })
                    .exec()
                    .then(movie => {
                        // If movie found meaning if array of movies is not empty
                        if (movie.length >= 1) {
                            return res.status(409).render('post-status', {
                                message: "Movie with provided title already exists in the database."
                            })
                        } else {
                            const movie = new Movie({
                                title: data.Title,
                                year: data.Year,
                                rated: data.Rated,
                                released: data.Released,
                                runtime: data.Runtime,
                                genre: data.Genre,
                                director: data.Director,
                                writer: data.Writer,
                                actors: data.Actors,
                                plot: data.Plot,
                                language: data.Language,
                                country: data.Country,
                                awards: data.Awards,
                                ratings: data.Ratings,
                                _id: new mongoose.Types.ObjectId(),
                            })
                            movie.save().then(result => {
                                res.status(201).render('post-status', {
                                    message: `Fetched and saved movie data successfully. Created movie: ${result.title} (${result.genre}), with ID of ${result._id}. You can request it with "GET" from: http://localhost:3000/movies/${result._id}`
                                })
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                        }
                    })
            }

        })
    });

router.get("/:movieId", (req, res, next) => {
    const id = req.params.movieId;
    Movie.findById(id)
        .select("title year rated released runtime genre director writer actors country awards plot language ratings _id")
        .exec()
        .then(doc => {
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
});

router.post("/:movieId", (req, res, next) => {
    const id = req.params.movieId;
    res.status(201).json({
        message: "Movie id is " + id,
        id: id,
    });
});

// Patching - not implemented on the frontend
router.patch("/:movieId",
    (req, res, next) => {
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
    });

// Deleting - not implemented on the frontend
router.delete("/:movieId",
    (req, res, next) => {
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