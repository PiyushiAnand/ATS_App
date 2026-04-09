import mongoose from "../db/mongoose";

const userSchema = new mongoose.Schema({
  // 🔥 External auth identifier (MOST IMPORTANT)
  user_id: { type: String, required: true, unique: true },

  // Optional user info (can come from JWT or later APIs)
  name: { type: String },
  email: { type: String },

  // ❌ REMOVE password (you are not handling auth)
  // password: { type: String, required: true },

  // Your learning data
  mastery: { type: Map, of: Number, default: {} },
  completedTopics: { type: [String], default: [] }

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);