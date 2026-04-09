import express, { Response } from "express";
import { Session } from "../models/Session";
import { Response as UserResponse } from "../models/Response";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ============================================================================
// 📍 Route 1: Start / Resume Session
// ============================================================================
router.post("/start", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.userId; 
    const { session_id, student_id } = req.body;

    if (!user_id || !session_id || !student_id) {
      return res.status(400).json({ 
        error: "user_id, session_id, and student_id are required." 
      });
    }

    // ✅ Idempotency: session_id is UNIQUE → reuse if exists
    let session = await Session.findOne({ session_id });

    if (session) {
      console.log("♻️ Resuming existing session:", session_id);
      return res.status(200).json({
        message: "Existing session resumed successfully!",
        session_id: session.session_id
      });
    }

    // ✅ Create new session
    session = await Session.create({
      user_id,
      student_id,
      session_id,
      responses: []
    });

    return res.status(201).json({
      message: "Session started successfully!",
      session_id: session.session_id
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to create/resume session.", 
      details: error.message 
    });
  }
});


// ============================================================================
// 📍 Route 2: Complete Session
// ============================================================================
router.post("/complete", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required." });
    }

    // ✅ Find all responses linked to this session_id
    const userResponses = await UserResponse.find({ session_id });

    if (userResponses.length === 0) {
      return res.status(404).json({ 
        message: "No responses found for this session." 
      });
    }

    const responseIds = userResponses.map((r) => r._id);

    // ✅ Update session using session_id (NOT _id)
    const updatedSession = await Session.findOneAndUpdate(
      { session_id },
      {
        responses: responseIds,
        endTime: new Date()
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ error: "Session not found." });
    }

    console.log("🏁 Session closed:", session_id);

    return res.status(200).json({
      message: "Session completed successfully!",
      session: updatedSession
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to complete session.", 
      details: error.message 
    });
  }
});

export default router;