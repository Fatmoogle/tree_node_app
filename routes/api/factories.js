const express = require("express");
const router = express.Router();

// Factory Model
const Factory = require("../../models/Factory");

// Get request for all factories
// Hits the route "/api/factories"
router.get("/", (req, res) => {
    Factory.find()
        .then(factories => res.json(factories))
});

// Post request for creating a factory
// Hits the route "/api/factories"
router.post("/", (req, res) => {
    // Destructuring the model attributes from the request body
    const { name, children, min, max, childArray } = req.body;
    const newFactory = new Factory({
        'name': name,
        'children': children,
        'min': min,
        'max': max,
        'childArray': childArray
    });

    newFactory.save().then(factory => res.json(factory));
});

// Put request for updating a factory
// Hits the route "/api/factories"
router.put("/:id", (req, res) => {
    const { name, children, min, max, childArray } = req.body;
    const updatedFactory = {
        'name': name,
        'children': children,
        'min': min,
        'max': max,
        'childArray': childArray
    }
    Factory.findOneAndUpdate(req.params.id, updatedFactory, { new: true })
        .then(factory => res.json(factory))
        .catch(err => res.json(err))
});


// Delete request for deleting a factory
// Hits the route "/api/factories"
router.delete("/:id", (req, res) => {
    Factory.findById(req.params.id)
        .then(factory => factory.remove().then(() => res.json({ success: true })))
        .catch(res => res.status(404).json({ success: false }))
});


module.exports = router;