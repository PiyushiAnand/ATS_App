import express from "express";
import { Assessment } from "../models/Assessment.ts";
import { AssessmentAttempt } from "../models/AssessmentAttempt.ts";
import { Content } from "../models/Content.ts";
import { authenticate } from "../middleware/auth.ts";

const router = express.Router();

// Fetch the assessment details (and populated questions) for a specific lesson
import mongoose from '../db/mongoose';

router.get("/lesson/:lessonId", authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // ✅ Validate ObjectId BEFORE using it
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Invalid lessonId" });
    }

    const assessment = await Assessment.findOne({
      lessonId: new mongoose.Types.ObjectId(lessonId),
    }).populate("questions"); // 🔥 remove field filtering temporarily

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.json(assessment);
  } catch (err) {
    console.error("Assessment error:", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

// Start a new attempt for an assessment
router.post("/start", authenticate, async (req, res) => {
  const { assessmentId } = req.body;
  try {
    const newAttempt = new AssessmentAttempt({
      userId: req.userId,
      assessmentId,
      score: 0,
      responses: []
    });
    await newAttempt.save();
    res.status(201).json({ attemptId: newAttempt._id, message: "Assessment started" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finish the assessment
router.post("/complete", authenticate, async (req, res) => {
  const { attemptId, finalScore } = req.body;
  try {
    const attempt = await AssessmentAttempt.findByIdAndUpdate(
      attemptId, 
      { isCompleted: true, score: finalScore, endTime: Date.now() },
      { new: true }
    );
    res.json({ message: "Assessment completed", attempt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;