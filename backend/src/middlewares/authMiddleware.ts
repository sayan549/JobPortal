import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

interface AuthRequest extends Request {
  user?: any;
}

export const requireSignIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header received:", authHeader); // ✅ Debug incoming header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("No Bearer token found.");
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token); // ✅ Debug token

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    console.log("Decoded token payload:", decoded); // ✅ Debug decoded data

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.warn("User not found for decoded ID:", decoded._id);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error.message || error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
