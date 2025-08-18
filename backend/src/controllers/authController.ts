import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

// POST /register
export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields including role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken((user._id as string).toString());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken((user._id as string).toString());

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};




// GET /current-user
export const currentUserController = async (req: Request, res: Response) => {
  try {
    // req.user is set by middleware
    const user = (req as any).user;

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//fetch user profile
export const getProfileController = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ PUT /update-profile
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { name, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




