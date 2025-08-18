import { Request, Response } from "express";
import SeekerProfile from "../models/SeekerProfile";

// Extend Request type to include multer's `file`
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getSeekerProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const profile = await SeekerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Seeker Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: (error as Error).message,
    });
  }
};

export const updateSeekerProfileController = async (
  req: MulterRequest,
  res: Response
) => {
  try {
    const userId = (req as any).user._id;
    const { fullName, email, phone, education, experience } = req.body;

    // Handle resume file upload
    let resumeUrl: string | undefined;
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    // Prepare update object (only include provided fields)
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (education) updateData.education = education;
    if (experience) updateData.experience = experience;
    if (resumeUrl) updateData.resumeUrl = resumeUrl;

    // Upsert (update if exists, otherwise create new)
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateData, $setOnInsert: { user: userId } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Seeker Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: (error as Error).message,
    });
  }
};


// ================== GET All Seeker Profiles (Recruiter) ==================
export const getAllSeekerProfilesController = async (req: Request, res: Response) => {
  try {
    const profiles = await SeekerProfile.find().populate("user", "role email"); 
    // populate adds info about the user (like role, email)

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Get All Seeker Profiles Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching seeker profiles",
      error: (error as Error).message,
    });
  }
};

// ================== GET Single Seeker Profile by ID (Recruiter) ==================
export const getSeekerProfileByIdController = async (req: Request, res: Response) => {
  try {
    const { seekerId } = req.params;
    const profile = await SeekerProfile.findOne({ user: seekerId }).populate("user", "role email");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Seeker Profile By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching seeker profile",
      error: (error as Error).message,
    });
  }
};