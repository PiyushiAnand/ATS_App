import express from "express";
import { Response } from "../models/Response.ts";
import { Content } from "../models/Content.ts";
import { User } from "../models/User.ts";
import { AssessmentAttempt } from "../models/AssessmentAttempt.ts";
import { authenticate } from "../middleware/auth.ts";

const router = express.Router();

router.post("/submit", authenticate, async (req, res) => {
  const { attemptId, questionId, kcId, selectedOption, timeTaken, hintCount, attemptCount } = req.body;

  try {
    // 1. Fetch the actual question to check the correct answer
    const question = await Content.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const isCorrect = question.correctAnswer === selectedOption;

    // 2. Save the student's response interaction
    const newResponse = new Response({
      userId: req.userId,
      problemId: questionId,
      kcId,
      correctness: isCorrect,
      timeTaken,
      hintCount,
      attemptCount
    });
    await newResponse.save();

    // Link this response to the active Assessment Attempt
    if (attemptId) {
      await AssessmentAttempt.findByIdAndUpdate(attemptId, {
        $push: { responses: newResponse._id }
      });
    }

    // 3. BAYESIAN KNOWLEDGE TRACING (BKT) MASTERY UPDATE
    // Fetch user to get current mastery for this KC
    const user = await User.findById(req.userId);
    
    // Default starting mastery if they've never encountered this KC before (e.g., 0.25)
    let currentMastery = user.mastery.get(kcId) || 0.25; 

    // BKT Parameters (You can tweak these based on your model)
    const P_T = 0.1; // Probability of transition (learning)
    const P_G = 0.2; // Probability of guess
    const P_S = 0.1; // Probability of slip

    let P_obs;
    if (isCorrect) {
      // P(L|Obs=Correct) formula
      P_obs = (currentMastery * (1 - P_S)) / 
              ((currentMastery * (1 - P_S)) + ((1 - currentMastery) * P_G));
    } else {
      // P(L|Obs=Incorrect) formula
      P_obs = (currentMastery * P_S) / 
              ((currentMastery * P_S) + ((1 - currentMastery) * (1 - P_G)));
    }

    // Calculate new mastery: P(L_{t+1}) = P_obs + (1 - P_obs) * P_T
    let newMastery = P_obs + ((1 - P_obs) * P_T);

    // Penalize mastery slightly if hints were used or multiple attempts taken
    if (hintCount > 0) newMastery *= 0.95; 
    
    // Ensure mastery stays between 0.01 and 0.99
    newMastery = Math.max(0.01, Math.min(0.99, newMastery));

    // Update the User document
    user.mastery.set(kcId, newMastery);
    await user.save();

    // 4. Send response back to the frontend
    res.json({
      correct: isCorrect,
      correctAnswer: isCorrect ? null : question.correctAnswer, // Only reveal if they got it wrong
      remedialExplanation: isCorrect ? null : question.remedialExplanation,
      newMasteryLevel: newMastery
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;