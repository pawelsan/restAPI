const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model("Comment", commentSchema);