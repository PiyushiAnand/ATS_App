import mongoose from "../db/mongoose";

const assessmentAttemptSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true 
  },
  assessmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Assessment", 
    required: true 
  },
  score: { 
    type: Number, 
    required: true // e.g., 4 (out of 5)
  },
  isCompleted: { 
    type: Boolean, 
    default: false // Turns true when they finish all 5 questions
  },
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  endTime: { 
    type: Date 
  },
  // An array linking to their specific answers for this attempt
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response" 
  }]
}, { timestamps: true });

export const AssessmentAttempt = mongoose.model("AssessmentAttempt", assessmentAttemptSchema);