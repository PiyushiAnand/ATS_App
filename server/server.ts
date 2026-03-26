import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "./db/mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cognipath";
const PORT = 3000;

async function startServer() {
  // Connect to MongoDB
  try {
    console.log("Connecting to MongoDB...");
    console.log("Using URI:", MONGODB_URI); // Log the URI to verify it's correct
    await mongoose.connect(MONGODB_URI);


    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
