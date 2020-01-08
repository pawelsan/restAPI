const mongoose = require("mongoose");
const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    year: { type: String, default: "Not available" },
    rated: { type: String, default: "Not available" },
    released: { type: String, default: "Not available" },
    runtime: { type: String, default: "Not available" },
    genre: { type: String, default: "Not available" },
    director: { type: String, default: "Not available" },
    writer: { type: String, default: "Not available" },
    actors: { type: String, default: "Not available" },
    plot: { type: String, default: "Not available" },
    language: { type: String, default: "Not available" },
    country: { type: String, default: "Not available" },
    awards: { type: String, default: "Not available" },
    ratings: { type: Array, default: "Not available" },
});

module.exports = mongoose.model("Movie", movieSchema);