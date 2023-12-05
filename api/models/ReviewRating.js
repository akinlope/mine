const mongoose = require("mongoose");

const reviewRatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const ReviewRating = mongoose.model("ReviewRating", reviewRatingSchema);

module.exports = ReviewRating