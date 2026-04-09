import express, { Response as ExResponse } from "express";
import { Response } from "../models/Response.ts";
import { Content } from "../models/Content.ts";
import { User } from "../models/User.ts";
import { AssessmentAttempt } from "../models/AssessmentAttempt.ts";
import { authenticate, AuthRequest } from "../middleware/auth.ts";

const router = express.Router();

router.post("/submit", authenticate, async (req: AuthRequest, res: ExResponse) => {
  const { 
    attemptId, 
    questionId, 
    kcId, 
    selectedOption, 
    timeTaken, 
    hintCount, 
    attemptCount,
    session_id
  } = req.body;

  try {
    // 1. Fetch the actual question to check the correct answer
    const question = await Content.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const isCorrect = question.correctAnswer === selectedOption;

    // 2. Save the student's response interaction
    const newResponse = new Response({
      user_id: req.userId,
      problemId: questionId,
      kcId,
      correctness: isCorrect,
      timeTaken,
      hintTaken: hintCount > 0, // Convert hintCount to a boolean for backward compatibility
      attemptCount,
      session_id: session_id
    });
    await newResponse.save();

    // Link this response to the active Assessment Attempt
    if (attemptId) {
      await AssessmentAttempt.findByIdAndUpdate(attemptId, {
        $push: { responses: newResponse._id }
      });
    }

    // 3. BAYESIAN KNOWLEDGE TRACING (BKT) MASTERY UPDATE
    const user = await User.findOne({ user_id: req.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Initial P values per KC (LLM generated)
    const kcParams = {
      "KC1": { P_L0: 0.35, P_T: 0.20, P_G: 0.25, P_S: 0.10 },
      "KC2": { P_L0: 0.25, P_T: 0.25, P_G: 0.20, P_S: 0.12 },
      "KC3": { P_L0: 0.30, P_T: 0.18, P_G: 0.22, P_S: 0.10 }
    };

    // Safely fallback just in case a new KC is passed later
    const params = kcParams[kcId] || { P_L0: 0.25, P_T: 0.20, P_G: 0.20, P_S: 0.10 };

    // Fetch current mastery, or initialize with P(L0) if they've never attempted this KC
    let currentMastery = user.mastery.get(kcId);
    if (currentMastery === undefined) {
      currentMastery = params.P_L0;
    }

    // Load the specific BKT parameters for this KC
    const P_T = params.P_T;
    let P_G = params.P_G;
    let P_S = params.P_S;

    // Algorithm Parameters (Adjustments)
    const alpha = 0.05;           // Penalty per hint used
    const beta = 0.05;            // Penalty per extra attempt
    const fast_threshold = 5;     // Answered in under 5 seconds
    const slow_threshold = 60;    // Answered in over 60 seconds
    const t1 = 0.1;               // Guess adjustment factor
    const t2 = 0.1;               // Slip adjustment factor
    const lambda = 0.1;           // Repeated error penalty

    // Time-based adjustment (Done BEFORE the Bayes formula)
    if (timeTaken < fast_threshold) {
      P_G += t1; // Answered very quickly -> probability of guessing increases
    } else if (timeTaken > slow_threshold) {
      P_S += t2; // Answered very slowly -> probability of slipping (fatigue) increases
    }

    // Ensure probabilities remain within valid bounds (0 to 1)
    P_G = Math.min(0.95, P_G); 
    P_S = Math.min(0.95, P_S);

    // Response Update
    let P_obs;
    if (isCorrect) {
      // P(L|Obs=Correct)
      P_obs = (currentMastery * (1 - P_S)) / 
              ((currentMastery * (1 - P_S)) + ((1 - currentMastery) * P_G));
    } else {
      // P(L|Obs=Incorrect)
      P_obs = (currentMastery * P_S) / 
              ((currentMastery * P_S) + ((1 - currentMastery) * (1 - P_G)));
    }

    // Learning Transition
    let newMastery = P_obs + ((1 - P_obs) * P_T);

    // Interaction Adjustments
    newMastery -= (alpha * (hintCount || 0));
    newMastery -= (beta * Math.max(0, (attemptCount || 1) - 1));

    // Repeated Error Adjustment
    if (attemptCount >= 3) {
      newMastery -= lambda;
    }

    // Ensure mastery stays securely between 0.01 and 0.99 
    newMastery = Math.max(0.01, Math.min(0.99, newMastery));

    // Update the User document
    user.mastery.set(kcId, newMastery);
    await user.save();

    // 4. Send response back to the frontend
    res.json({
      correct: isCorrect,
      correctAnswer: isCorrect ? null : question.correctAnswer, 
      remedialExplanation: isCorrect ? null : question.remedialExplanation,
      newMasteryLevel: newMastery
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;