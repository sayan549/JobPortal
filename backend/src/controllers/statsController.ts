// src/controllers/statsController.ts

import { Request, Response } from "express";
import Job from "../models/Job";
import Application from "../models/Application";

export const getStatsController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // Total jobs created by the user
    const totalJobs = await Job.countDocuments({ createdBy: userId });

    // Total applications received on all their jobs
    const userJobs = await Job.find({ createdBy: userId }).select("_id");
    const jobIds = userJobs.map(job => job._id);
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Top 5 most-applied jobs (optional)
    const topJobs = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          applications: { $sum: 1 },
        },
      },
      {
        $sort: { applications: -1 },
      },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      { $unwind: "$jobInfo" },
      {
        $project: {
          _id: 0,
          jobId: "$jobInfo._id",
          position: "$jobInfo.position",
          company: "$jobInfo.company",
          applications: 1,
        },
      },
    ]);

    res.status(200).json({
      totalJobs,
      totalApplications,
      topJobs,
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
