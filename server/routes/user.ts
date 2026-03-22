import express from "express";
import { User } from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ name: user.name, email: user.email, mastery: user.mastery, completedTopics: user.completedTopics });
});

router.post("/state", authenticate, async (req: AuthRequest, res) => {
  const { mastery, completedTopics } = req.body;
  try {
    await User.findByIdAndUpdate(req.userId, { mastery, completedTopics });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
