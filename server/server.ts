import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "./db/mongoose";
import app from "./app"; // Your express app with your API routes
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port config
const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cognipath";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("Using MONGODB_URI:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // Trust proxy (important for cookies in production)
  app.set("trust proxy", 1);

  // =========================
  // ✅ SERVE FRONTEND (Vite build)
  // =========================
  const frontendPath = path.join(__dirname, "../src/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // =========================
  // ✅ API ROOT (optional)
  // =========================
  app.get("/api", (req, res) => {
    res.status(200).json({
      message: "Backend API is running successfully!",
      timestamp: new Date().toISOString(),
    });
  });

  // =========================
  // ✅ REACT FALLBACK (SPA)
  // =========================
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  // =========================
  // 🚀 START SERVER
  // =========================
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();