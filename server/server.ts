import express from "express";
import mongoose from "./db/mongoose";
import dotenv from "dotenv";
import app from "./app"; // Your express app with your API routes

dotenv.config();

// Render sets process.env.PORT automatically (usually 10000)
const PORT = process.env.PORT || 3000; 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cognipath";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // Pure API Root Route
  app.get("/", (req, res) => {
    res.status(200).json({ 
      message: "Backend API is running successfully!",
      timestamp: new Date().toISOString()
    });
  });

  // 🚀 Tell Express to trust Render's HTTPS proxy so secure cookies are allowed to pass!
  app.set("trust proxy", 1);
  // 0.0.0.0 is required for Render to bind to the port
  app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer();