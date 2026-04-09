import mongoose from "../db/mongoose";

const sessionSchema = new mongoose.Schema({
  // 🔥 Link to external auth system
  user_id: { 
    type: String, 
    required: true 
  },

  // 🔥 From redirect URL (MANDATORY in your system)
  student_id: { 
    type: String, 
    required: true 
  },

  session_id: { 
    type: String, 
    required: true,
    unique: true   // ✅ prevents duplicate submissions
  },

  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },

  // 📂 Quiz responses inside this session
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response"
  }]

}, { timestamps: true });

export const Session = mongoose.model("Session", sessionSchema);