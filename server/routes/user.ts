import express, { Response } from "express";
import { User } from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// 1. Get Current User Profile
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Successfully return the data
    res.json({ 
      name: user.name, 
      email: user.email, 
      mastery: user.mastery, 
      completedTopics: user.completedTopics 
    });
  } catch (err: any) {
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
    await User.findByIdAndUpdate(req.userId, { completedTopics });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;