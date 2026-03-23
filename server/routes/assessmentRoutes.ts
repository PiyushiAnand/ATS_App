import express from "express";
import { Assessment } from "../models/Assessment.ts";
import { AssessmentAttempt } from "../models/AssessmentAttempt.ts";
import { Content } from "../models/Content.ts";
import { authenticate } from "../middleware/auth.ts";

const router = express.Router();

// Fetch the assessment details (and populated questions) for a specific lesson
router.get("/lesson/:lessonId", authenticate, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ lessonId: req.params.lessonId })
      .populate("questions", "difficulty kcId options questionText hint mediaUrl"); 
      // Note: We deliberately EXCLUDE 'correctAnswer' from populate so students can't cheat!

    if (!assessment) return res.status(404).json({ error: "Assessment not found" });
    
    res.json(assessment);
  } catch (err) {
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