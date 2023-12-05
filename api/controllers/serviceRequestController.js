const express  = require("express");
const router = express.Router()
const ServiceRequest = require("../models/ServiceRequest");

// Route to create a new service request
router.post("/", async(req, res)=> {
    try {
        const { user, service, additionalNotes } = req.body;
        const newServiceRequest = await ServiceRequest.create({
            user,
            service, 
            additionalNotes
        });
        res.status(200).json(newServiceRequest);
    } catch (err) {
        console.log("Error creating service request:", err);
        res.status(500).json({ error: "Failed to create service request." })
    }
});

// Route to get all service requests
router.get("/", async (req, res)=> {
    try {
        const serviceRequests = await ServiceRequest.find();
        res.status(200).json(serviceRequests);
    } catch (err) {
        console.log("Error fetching services", err);
        res.status(500).json({ error: "Failed to fetch service request." })
    }
});

// Route to get a single service request by ID
router.get("/:id", async(req, res)=> {
    try{
        const serviceRequest = await ServiceRequest.findById(req.params.id);
        if(!serviceRequest){
            res.status(400).json({ error: "Service request not found" })
        }
        res.status(200).json(serviceRequest)
    } catch (err) {
        console.log("Error fetching service", err);
        res.status(500).json({ error: "Failed to fetch service request"})
    }
});

// Route to update a service request by ID
router.put("/:id", async(req, res)=> {
    try{
        const updateServiceRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
            );
        if(!updateServiceRequest){
            res.status(400).json({ error: "Service request not found" })
        }
        res.status(200).json(updateServiceRequest)
    } catch (err) {
        console.log("Error updating service", err);
        res.status(500).json({ error: "Failed to update service request"})
    }
});

// Route to delete a service request by ID
router.delete("/:id", async(req, res)=> {
    try{
        const deleteServiceRequest = await ServiceRequest.findByIdAndDelete(req.params.id);
        if(!deleteServiceRequest){
            res.status(400).json({ error: "Service request not found" })
        }
        res.status(200).json(["Deleted."])
    } catch (err) {
        console.log("Error deleting service", err);
        res.status(500).json({ error: "Failed to delete service request"})
    }
});

module.exports = router;