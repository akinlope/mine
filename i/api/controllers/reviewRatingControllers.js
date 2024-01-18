const express = require("express");
const router = express.Router();
const ReviewRating = require("../models/ReviewRating");


// Route to create a new review rating
router.post("/", async (req, res) => {
    try {
        const { user, service, rating, review } = req.body;
        const newReviewRating = await ReviewRating.create({
            user,
            service,
            rating,
            review
        });
        res.status(200).json(newReviewRating);
    } catch (err) {
        console.log("Error creating review-ratingrequest:", err);
        res.status(500).json({ error: "Failed to create review-rating request." })
    }
});

// Route to get all review rating
router.get("/", async (req, res) => {
    try {
        const reviewRating = await ReviewRating.find();
        res.status(200).json(reviewRating);
    } catch (err) {
        console.log("Error fetching review-rating", err);
        res.status(500).json({ error: "Failed to fetch review-rating request." })
    }
});

// Route to get a single review rating by ID
router.get("/:id", async (req, res) => {
    try {
        const reviewRating = await ReviewRating.findById(req.params.id);
        if(!reviewRating){
            res.status(400).json({ error: "Review-rating not found." })
        }
        res.status(200).json(reviewRating);
    } catch (err) {
        console.log("Error fetching review-rating", err);
        res.status(500).json({ error: "Failed to fetch review-rating request." })
    }
});

// Route to update a review rating by ID
router.put("/:id", async (req, res) => {
    try {
        const updateReviewRating = await ReviewRating.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if(!updateReviewRating){
            res.status(400).json({ error: "Review-rating not found." })
        }
        res.status(200).json(updateReviewRating);
    } catch (err) {
        console.log("Error fetching review-rating", err);
        res.status(500).json({ error: "Failed to update review-rating request." })
    }
});

// Route to delete a review rating request by ID
router.delete("/:id", async (req, res)=> {
    try {
        const deleteReviewRating = await ReviewRating.findByIdAndDelete(req.params.id);
        if(!deleteReviewRating){
            res.status(400).json({ error: "Review-rating not found." })
        }
        res.status(200).json("Delete!.")
    } catch (err) {
        console.log("Error fetching review-rating", err);
        res.status(500).json({ error: "Failed to delete review-rating request." })
    }
});

module.exports = router;