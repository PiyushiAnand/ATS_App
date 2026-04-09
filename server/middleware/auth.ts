import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
console.log("JWT_SECRET in auth middleware:", JWT_SECRET);
export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Headers:", req.headers);
  console.log("All cookies:", req.cookies);
  
  // 1. Check for token in cookies (existing logic)
  let token = req.cookies.token;
  
  // 2. Overwrite/Check for token in Authorization: Bearer <token> (new logic)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Token extracted from Authorization header:", token);
  }

  console.log("token received:", token);
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = (decoded as any).userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

