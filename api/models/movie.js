const mongoose = require("mongoose");
const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    genre: { type: String, required: true },
});

module.exports = mongoose.model("Movie", movieSchema);