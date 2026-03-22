import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mastery: { type: Map, of: Number, default: {} },
  completedTopics: { type: [String], default: [] }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
