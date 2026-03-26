import mongoose from "../db/mongoose";
import { Document, Schema, Model } from "mongoose";

// 1. Define the TypeScript Interface for the Content Document
export interface IContent extends Document {
  kcId: "KC1" | "KC2" | "KC3"; // Knowledge Components: Data Rep, Pie Chart, Probability
  difficulty: "Easy" | "Medium" | "Hard";
  questionText: string;
  mediaUrl?: string | null;
  animation: {
      type: {
        type: String,
        enum: [
          "tally-build",
          "pictograph-scale",
          "bar-grow",
          "double-bar-compare",
          "pie-chart"
        ],
        default: null
      },
  
      // Optional config for frontend control
      config: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    },
  options: string[];
  correctAnswer: string;
  hint?: {
    text: string | null;
    unlockTime: number;
  };
  remedialExplanation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create the Mongoose Schema
const contentSchema: Schema<IContent> = new mongoose.Schema(
  {
    kcId: {
      type: String,
      required: true,
      enum: ["KC1", "KC2", "KC3"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    questionText: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      default: null, // Store AWS S3 / Cloudinary URL here if the question has an image/video
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length === 4; // Ensures standard 4-option MCQs
        },
        message: "A question must have exactly 4 options.",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    hint: {
      text: { type: String, default: null },
      unlockTime: { type: Number, default: 0 }, // e.g., 10 for Medium, 20 for Hard
    },
    remedialExplanation: {
      type: String,
      default: null, // Used for concept errors or repeated errors
    },
    animation: {
        type: {
          type: String,
          enum: [
            "tally-build",
            "pictograph-scale",
            "bar-grow",
            "double-bar-compare",
            "pie-chart"
          ],
          default: null
        },
    
        // Optional config for frontend control
        config: {
          type: mongoose.Schema.Types.Mixed,
          default: null
        }
      }
  },
  { 
    timestamps: true 
  }
);

// 3. Export the Model
export const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>("Content", contentSchema);