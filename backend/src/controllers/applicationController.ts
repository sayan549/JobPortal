// controllers/applicationController.ts
import { Request, Response } from "express";
import mongoose from "mongoose"; // ✅ Missing import
import Application from "../models/Application";
import Job from "../models/Job";
import SeekerProfile from "../models/SeekerProfile"; // ✅ Import SeekerProfile for enriching applications

// ✅ Unified AuthRequest type
interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    role: "jobseeker" | "recruiter";
  };
}

// ✅ Apply to a job
export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const seekerId = req.user._id;
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const alreadyApplied = await Application.findOne({ jobId, seekerId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      jobId,
      seekerId,
      recruiterId: job.createdBy,
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get applied jobs for seeker (with recruiter details)
export const getAppliedJobs = async (req: AuthRequest, res: Response) => {
  try {
    // Ensure user is logged in
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const seekerId = req.user._id;

    // Ensure seekerId is valid
    if (!mongoose.Types.ObjectId.isValid(seekerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const applications = await Application.find({ seekerId })
      .populate({
        path: "jobId",
        populate: {
          path: "createdBy", // recruiter info
          select: "name email companyName",
        },
      })
      .sort({ createdAt: -1 })
      .lean(); // better performance since no mongoose document methods needed

    // Optional: Filter out any applications where job no longer exists
    const validApplications = applications.filter(app => app.jobId);

    res.status(200).json({
      success: true,
      count: validApplications.length,
      applications: validApplications,
    });
  } catch (error) {
    console.error("❌ getAppliedJobs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching applied jobs",
    });
  }
};

// ✅ Get all applications for a recruiter
export const getRecruiterApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recruiterId = req.user._id;

    const applications = await Application.find({ recruiterId })
      .populate("jobId") // full job details
      .populate({
        path: "seekerId",
        model: "User",
        select: "name email", // basic account info
      })
      .lean();

    // ✅ Fetch profiles for each seeker
    const seekerIds = applications.map(app => app.seekerId?._id).filter(Boolean);
    const seekerProfiles = await SeekerProfile.find({ user: { $in: seekerIds } }).lean();

    // ✅ Merge profile data into applications
    const enrichedApplications = applications.map(app => {
      const profile = seekerProfiles.find(p => String(p.user) === String(app.seekerId?._id));
      return { ...app, seekerProfile: profile || null };
    });

    res.json({ applications: enrichedApplications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
