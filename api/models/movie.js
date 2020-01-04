const mongoose = require("mongoose");
const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    genre: String
});

module.exports = mongoose.model("Movie", movieSchema);