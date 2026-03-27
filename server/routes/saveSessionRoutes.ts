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
    // req.userId comes from your existing `authenticate` middleware
    const userId = req.userId; 

    if (!userId) {
      return res.status(400).json({ error: "User ID missing from authentication." });
    }

    const newSession = new Session({
      userId,
      Responses: [] // Starts empty
    });

    await newSession.save();

    return res.status(201).json({
      message: "Session started successfully!",
      sessionId: newSession._id
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create session.", details: error.message });
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
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        Responses: responseIds,
        endTime: new Date() // Mark the session as completed
      },
      { new: true } // Return updated document state to frontend
    );

    if (!updatedSession) {
      return res.status(404).json({ error: "Session tracking document not found." });
    }

    return res.status(200).json({
      message: "Successfully synchronized responses into sitting session!",
      session: updatedSession
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to compile session.", details: error.message });
  }
});

export default router;