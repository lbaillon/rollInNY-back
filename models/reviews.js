const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    place: {type: mongoose.Schema.Types.ObjectId, ref:"places"},
    createdAt: Date,
    note: Number,
    content: String
})

const Review = mongoose.model("reviews", reviewSchema)
module.exports = Review