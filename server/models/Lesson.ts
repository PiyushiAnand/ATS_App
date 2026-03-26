import mongoose from "../db/mongoose";

const lessonSchema = new mongoose.Schema({
  kcId: { 
    type: String, 
    required: true, // e.g., "KC1" (Data Representation)
  },
  subtopicName: {
    type: String,
    required: true // e.g., "Subtopic 1: Introduction to Data and Organising Data"
  },
  order: {
    type: Number, // To ensure Subtopic 1 comes before Subtopic 2
    required: true
  },
  learningContent: {
    type: String,
    required: true // e.g., "Information collected in various situations... is called data."
  },
  exampleText: {
    type: String, // e.g., "A teacher asks 20 students in a Delhi school about their favorite Indian snack..."
  },
  mediaUrl: {
    type: String, // For images of tables, tally marks, or graphs (hosted on S3/Cloudinary)
    default: null
  },
  videoUrl: {
    type: String, // You mentioned using animations/videos for things like Drawing a Pie Chart
    default: null
  },
  // =========================
  // 🎬 NEW: Animation Support
  // =========================
  animation: {
    type: {
      type: String,
      enum: [
        "tally-build",
        "pictograph-scale",
        "bar-grow",
        "double-bar-compare",
        "pie-chart",
        "pie-drawing",
        "chance-scale",
        "coin-flip",
        "equal-outcomes",
        "probability-fraction",
        "event-highlight",
        "complementary-probability"
      ],
      default: null
    },

    // Optional config for frontend control
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  }
}, { timestamps: true });

export const Lesson = mongoose.model("Lesson", lessonSchema);