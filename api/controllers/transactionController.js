const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Route to get all transactions 
router.get("/", async (req, res) => {
    try {
        const transaction = await Transaction.find();
        res.status(200).json(transaction);
    } catch (err) {
        console.log("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transacion" });
    }
});

// Route to post a transaction
router.post("/", async (req, res) => {
    try {
        const newTransaction = await Transaction.create(req.body);
        res.status(201).json(newTransaction);
    } catch (err) {
        console.log("Error creating transaction:", err.message);
        res.status(500).json({ error: "Failed to create transaction." })
    }
});

// Route to get a single transaction by ID
router.get("/:id", async(req, res)=> {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found." });
        }
        res.status(200).json(transaction);
    } catch (err) {
        console.log("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transacion" });
    }
});

// Route to update a transaction by ID
router.put("/:id", async(req, res)=> {
    try{
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found." })
        }
        res.status(200).json(updatedTransaction)
    } catch (err) {
        console.log("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transacion" });
    }
});

// Route to delete a transaction by ID
router.delete("/:id", async (req, res)=> {
    try {
        const deletedTransaction = await Service.findByIdAndDelete(req.params.id);
        if(!deletedTransaction){
            return res.status(404).json({ error: "Transaction not found." })
        }
        res.status(200).json("Deleted!.");
    } catch (err) {
        console.log("Error deleting transaction", err);
        res.status(400).json({ error: "Failed to delete transaction."})
    }
});


module.exports = router;