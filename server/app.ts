import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
// Import the new routes
import lessonRoutes from "./routes/lessonRoutes"; 
import assessmentRoutes from "./routes/assessmentRoutes";
import responseRoutes from "./routes/responseRoutes";
import masteryRoute from "./routes/masteryRoute";
import cors from "cors";
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// Mount the new routes
app.use("/api/lessons", lessonRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/mastery", masteryRoute);

app.use(
  cors({
    origin: "http://localhost:5173", // Your local React dev server
    credentials: true,               // Crucial for HTTP cookies and JWT to pass through!
  })
);
// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;