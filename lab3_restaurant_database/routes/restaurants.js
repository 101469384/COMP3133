import express from "express";
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find().sort({ createdAt: -1 });
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid restaurant id" });
        }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return res.status(404).json({ error: "Not found" });

        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        const { name, city, cuisine, rating } = req.body;

        if (!name || !city || !cuisine || rating === undefined) {
            return res.status(400).json({
                error: "name, city, cuisine, rating are required"
            });
        }

        const created = await Restaurant.create({ name, city, cuisine, rating });
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid restaurant id" });
        }

        const updated = await Restaurant.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ error: "Not found" });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid restaurant id" });
        }

        const deleted = await Restaurant.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        res.json({ message: "Deleted ✅", deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;


