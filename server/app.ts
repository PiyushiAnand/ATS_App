import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

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
