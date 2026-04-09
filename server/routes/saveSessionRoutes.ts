import express, { Response } from "express";
import { Session } from "../models/Session";
import { Response as UserResponse } from "../models/Response";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ============================================================================
// 📍 Route 1: Assign and start a new Session
// Returns the newly created session_id to the frontend.
// ============================================================================
router.post("/start", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 
    const { sessionId } = req.body; // Allow optional sessionId for idempotency

    if (!userId) {
      return res.status(400).json({ error: "User ID missing from authentication." });
    }

    // ✅ Idempotency Check: If sessionId is provided, check if it already exists
    if (sessionId) {
      const existingSession = await Session.findOne({ _id: sessionId, userId });
      if (existingSession) {
        console.log("♻️ Resuming existing session:", sessionId);
        return res.status(200).json({
          message: "Existing session resumed successfully!",
          sessionId: existingSession._id
        });
      }
    }

    const newSession = new Session({
      userId,
      externalStudentId: req.body.studentId, // From frontend getSessionInfo()
      externalSessionId: req.body.sessionId, // From frontend getSessionInfo()
      Responses: [] 
    });

    await newSession.save();

    return res.status(201).json({
      message: "Session started successfully!",
      sessionId: newSession._id
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create/resume session.", details: error.message });
  }
});

// ============================================================================
// 📍 Route 2: Combine responses having the same session_id and save to session
// Automatically searches for answers the user provided during that sitting.
// ============================================================================
router.post("/complete", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required in body." });
    }

    // 1. Query the 'Response' collection to find all answers recorded for this session ID
    const userResponses = await UserResponse.find({ sessionId });

    if (userResponses.length === 0) {
      return res.status(404).json({ 
        message: "No responses were found recorded for this sessionId." 
      });
    }

    // Isolate just the Mongo Object IDs
    const responseIds = userResponses.map((response) => response._id);

    // 2. Find the session document and update it with the array of responses and the endTime
    // 🛠️ Sanity Check: Ensure we don't 'invent' 0 for missing values. 
    // Preferred rule is NaN, but JSON sends 'null'. Tell Merge Team during integration.
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        Responses: responseIds,
        endTime: new Date() // Mark the session as completed
      },
      { new: true } 
    );

    if (!updatedSession) {
      return res.status(404).json({ error: "Session tracking document not found." });
    }

    console.log("🏁 Session synchronized and closed:", sessionId);
    return res.status(200).json({
      message: "Successfully synchronized responses into sitting session!",
      session: updatedSession
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to compile session.", details: error.message });
  }
});

export default router;