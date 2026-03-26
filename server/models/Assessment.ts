import mongoose from "../db/mongoose";

const assessmentSchema = new mongoose.Schema({
  kcId: { 
    type: String, 
    required: true, // e.g., "KC1"
    enum: ["KC1", "KC2", "KC3"]
  },
  subtopicName: {
    type: String,
    required: true // e.g., "Subtopic 1: Introduction to Data"
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true // Links this assessment directly to the reading material
  },
  // This stores the IDs of the 5 questions (Content) for this specific assessment
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true
  }],
  totalMarks: {
    type: Number,
    default: 5 // Since your design has 5 questions per subtopic
  }
}, { timestamps: true });

export const Assessment = mongoose.model("Assessment", assessmentSchema);