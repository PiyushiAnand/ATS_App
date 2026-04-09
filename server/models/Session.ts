import mongoose from "../db/mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  externalStudentId: { type: String }, // Store student_id from redirect URL
  externalSessionId: { type: String }, // Store session_id from redirect URL
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  // 📂 Links to all the quizzes they took in this one sitting!
  Responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response"
  }]
}, { timestamps: true });


export const Session = mongoose.model("Session", sessionSchema);