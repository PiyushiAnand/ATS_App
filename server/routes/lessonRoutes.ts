import express from "express";
import { Lesson } from "../models/Lesson.js"; // Adjust path as needed
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get a specific lesson by Knowledge Component (KC) and order (Subtopic number)
router.get("/:kcId/:order", authenticate, async (req, res) => {
  try {
    const { kcId, order } = req.params;
    const lesson = await Lesson.findOne({ kcId, order: parseInt(order) });
    
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all lessons for a specific Knowledge Component (to build a table of contents)
router.get("/topic/:kcId", authenticate, async (req, res) => {
  try {
    const lessons = await Lesson.find({ kcId: req.params.kcId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;