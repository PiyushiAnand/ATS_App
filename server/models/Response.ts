import mongoose, { Document, Schema, Model, Types } from "mongoose";

// 1. Define the TypeScript Interface for the Response Document
export interface IResponse extends Document {
  userId: Types.ObjectId; // Reference to the User
  problemId: Types.ObjectId; // Reference to the Content (Question)
  kcId: "KC1" | "KC2" | "KC3"; // The specific Knowledge Component being tested
  correctness: boolean; // True if the student got it right, False if wrong
  timeTaken: number; // Time in seconds spent on the question
  hintTaken: boolean; // Whether a hint was taken (true if yes, false if no)
  attemptCount: number; // Which attempt this was (1 for first try, etc.)
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create the Mongoose Schema
const responseSchema: Schema<IResponse> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    kcId: {
      type: String,
      required: true,
      enum: ["KC1", "KC2", "KC3"], // Ensures responses are tied to valid KCs
    },
    correctness: {
      type: Boolean,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true, // Crucial for analyzing if a student is guessing (too fast) or struggling (too slow)
    },
    hintTaken: {
      type: Boolean,
      default: false, // Defaults to false if no hints were unlocked or used
    },
    attemptCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Export the Model
export const Response: Model<IResponse> = mongoose.models.Response || mongoose.model<IResponse>("Response", responseSchema);