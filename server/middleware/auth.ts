import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
// console.log("JWT_SECRET in auth middleware:", JWT_SECRET);
export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ DO NOT VERIFY — just decode
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = (decoded as any).user_id;
    next();

  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};