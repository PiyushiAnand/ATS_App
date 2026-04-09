import express, { Response } from "express";
import { User } from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// 1. Get Current User Profile
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // 🔥 Use user_id instead of _id
    let user = await User.findOne({ user_id: req.userId });

    // 🔥 Auto-create user if not found (recommended)
    if (!user) {
      user = await User.create({
        user_id: req.userId,
        mastery: {},
        completedTopics: []
      });
    }

    // ✅ Return safe response
    res.json({ 
      name: user.name || "", 
      email: user.email || "", 
      mastery: user.mastery || {}, 
      completedTopics: user.completedTopics || [] 
    });

  } catch (err: any) {
    console.error("GET /me ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Update State 
// ⚠️ WARNING: Only use this for completing topics, NOT for updating mastery!
router.post("/state", authenticate, async (req: AuthRequest, res: Response) => {
  const { completedTopics } = req.body; 
  
  try {
    // Notice I removed 'mastery' from the update payload. 
    // Mastery should ONLY be updated by your BKT algorithm when a student submits an answer.
    console.log("Updating completed topics for user:", req.userId, "New completed topics:", completedTopics);
    await User.findByIdAndUpdate(req.userId, { completedTopics });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;