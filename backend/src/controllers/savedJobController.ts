// controllers/savedJobController.ts
import { Request, Response } from "express";
import SavedJob from "../models/SavedJob";

// POST /api/v1/saved-jobs/save
export const saveJobController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const savedJob = await SavedJob.create({ user: userId, job: jobId });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Job already saved" });
    }
    console.error("Save Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/saved-jobs/my
export const getSavedJobsController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const savedJobs = await SavedJob.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/v1/saved-jobs/:id
export const deleteSavedJobController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user._id;
    const { id } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!savedJob) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Saved job removed",
    });
  } catch (error) {
    console.error("Delete Saved Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
