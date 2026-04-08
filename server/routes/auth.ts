import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  //   res.cookie("token", token, { httpOnly: true, secure: true,      
  //  sameSite: "none",  
  //  partitioned: true
  //  });
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",   // 🔥 CRITICAL FIX
});
    res.json({ name: user.name, email: user.email, mastery: user.mastery, completedTopics: user.completedTopics });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", partitioned: true });
  res.cookie("token", token, {
      httpOnly: true,
      secure: false,        // ✅ IMPORTANT for local/server without HTTPS
      sameSite: "lax",  
      path: "/",   // 🔥 CRITICAL FIX    // ✅ works on same-origin
    });
    res.json({ name: user.name, email: user.email, mastery: user.mastery, completedTopics: user.completedTopics });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
  });
  res.json({ success: true });
});

export default router;
