import { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";

// POST /api/v1/job/create
export const createJobController = async (req: Request, res: Response) => {
  try {
    const {
      company,
      position,
      workLocation,
      workType,
      applyBy,
      salary,
      experience,
      aboutCompany,
      aboutJob,
      skillsRequired,
      additionalInfo,
    } = req.body;

    if (
      !company ||
      !position ||
      !workLocation ||
      !workType ||
      !applyBy ||
      !salary ||
      !experience ||
      !aboutCompany ||
      !aboutJob ||
      !skillsRequired
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const createdBy = (req as any).user._id;

    const job = await Job.create({
      company,
      position,
      workLocation,
      workType,
      applyBy,
      salary,
      experience,
      aboutCompany,
      aboutJob,
      skillsRequired,
      additionalInfo,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/job
export const getJobsController = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ createdBy: (req as any).user._id })
      .select("position workLocation salary experience createdAt workType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/v1/job/update/:id
export const updateJobController = async (req: any, res: Response) => {
  try {
    const {
      company,
      position,
      workLocation,
      workType,
      applyBy,
      salary,
      experience,
      aboutCompany,
      aboutJob,
      skillsRequired,
      additionalInfo,
    } = req.body;

    if (!company || !position) {
      return res
        .status(400)
        .json({ message: "Company and position are required" });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized" });
    }

    job.company = company;
    job.position = position;
    job.workLocation = workLocation || job.workLocation;
    job.workType = workType || job.workType;
    job.applyBy = applyBy || job.applyBy;
    job.salary = salary || job.salary;
    job.experience = experience || job.experience;
    job.aboutCompany = aboutCompany || job.aboutCompany;
    job.aboutJob = aboutJob || job.aboutJob;
    job.skillsRequired = skillsRequired || job.skillsRequired;
    job.additionalInfo = additionalInfo || job.additionalInfo;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/v1/job/delete/:id
export const deleteJobController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== (req as any).user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/job/all
export const getAllJobsController = async (req: Request, res: Response) => {
  try {
    const { search, sort, page = 1, workLocation } = req.query;
    const ITEMS_PER_PAGE = 6;

    const queryObj: any = { createdBy: (req as any).user._id };

    if (search) {
      queryObj.position = { $regex: search, $options: "i" };
    }

    if (workLocation) {
      queryObj.workLocation = { $regex: workLocation as string, $options: "i" };
    }

    let query = Job.find(queryObj);

    if (sort === "latest") query = query.sort("-createdAt");
    else if (sort === "oldest") query = query.sort("createdAt");
    else if (sort === "a-z") query = query.sort("position");
    else if (sort === "z-a") query = query.sort("-position");

    const totalJobs = await Job.countDocuments(queryObj);
    const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE);
    const skip = (Number(page) - 1) * ITEMS_PER_PAGE;

    const jobs = await query.skip(skip).limit(ITEMS_PER_PAGE);

    res.status(200).json({
      totalJobs,
      totalPages,
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    console.error("Get all jobs error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/job/single/:id
export const getSingleJobController = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/v1/job/search
export const searchJobsController = async (req: Request, res: Response) => {
  try {
    const { keyword, workLocation, workType } = req.query;

    const query: any = {};

    if (keyword) {
      query.$or = [
        { position: { $regex: keyword, $options: "i" } },
        { aboutJob: { $regex: keyword, $options: "i" } },
      ];
    }

    if (workLocation) {
      query.workLocation = { $regex: workLocation as string, $options: "i" };
    }

    if (workType) {
      query.workType = workType;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Job search error:", error);
    res.status(500).json({ message: "Error searching jobs" });
  }
};

// GET /api/v1/job/my-jobs
export const getRecruiterJobsController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiterId = (req as any).user._id;
    const jobs = await Job.find({ createdBy: recruiterId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching recruiter jobs", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
