import express, { Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { User } from "../models/User";

const router = express.Router();

// 🔥 GET USER MASTERY ONLY
router.get("/get_mastery", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("mastery");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      mastery: user.mastery || {},
      completedTopics: user.completedTopics || []
    });

  } catch (err: any) {
    console.error("Mastery fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;