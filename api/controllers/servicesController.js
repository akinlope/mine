const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

//Route to create a new service 
router.post("/", async (req, res)=> {
    try {
        const newService = await Service.create(req.body);
        res.status(201).json(newService);
    } catch (err){
        console.log("Error creating service:", err.message);
        res.status(500).json({ error: "Failed to create service." })
    }
});

// Route to get all services
router.get("/", async (req, res)=> {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err){
        console.log("Error fetching services:", err);
        res.status(500).json({ error: "Failed to fetch services"})
    }
});

// Route to get a single service by ID
router.get("/:id", async (req, res)=> {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: "Service not found." });
        }
        res.status(200).json(service);
    } catch(err) {
        console.log("Error fetching service:", err);
        res.status(500).json({ error: "Failed to fetch service"})
    }
});

// Route to update a service by ID
router.put("/:id", async (req, res)=> {
    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        if (!updatedService) {
            return res.status(404).json({ error: "Service not found." })
        }
        res.status(200).json(updatedService)
    } catch (err) {
        console.log("Error updating service:", err);
        res.status(500).json({ error: "Failed to update service." })
    }
});

// Route to delete a service by ID
router.delete("/:id", async (req, res)=> {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if(!deletedService){
            return res.status(404).json({ error: "Service not found." })
        }
        res.status(200).json("Deleted!.");
    } catch (err) {
        console.log("Error deleting service", err);
        res.status(400).json({ error: "Failed to delete service."})
    }
});


module.exports = router;