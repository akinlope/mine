const express = require("express");
const router = express.Router();
const User = require("../models/User") //User model

// Routes defined
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/register", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        tellNo: req.body.tellNo,
        address: req.body.address,
        password:req.body.password
    });

    // console.log('user:', user);
    try {
        const newUser = await user.save();
        // console.log("newUser:", newUser);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

// Route to get a single user
router.get("/:id", async (req, res) => {
    try {
        const singleUser = await User.findById(req.params.id);
        if (!singleUser) {
            return res.status(404).json({ error: "User not found." })
        }
        res.status(200).json(singleUser);
    } catch (err) {
        console.log("Error fetching user", err);
        res.status(500).json({ error: "Failed to fetch user" })
    }
});

// Route to update a user by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(400).json({ error: "User not found." })
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error updating user:", err);
        res.status(500).json({ errror: "Failed to update user"})
    }
});

// Route to delete a user
router.delete("/:id", async(req, res)=> {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser){
            return res.status(404).json({error: "User not found."})
        }
        res.status(200).json("Deleted!.")
    } catch (err) {
        console.log("Error deleteing user:", err);
        res.status(500).json({error: "Failed to delete user"})
    }
})



module.exports = router;