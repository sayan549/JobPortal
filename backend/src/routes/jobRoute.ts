import express from "express";
import {
  createJobController,
  getJobsController,
  updateJobController,
  deleteJobController,
  getAllJobsController,
  searchJobsController,
  getSingleJobController,
  getRecruiterJobsController,
} from "../controllers/jobController";
import { requireSignIn } from "../middlewares/authMiddleware";

const router = express.Router();

// Create, Update, Delete
router.post("/create", requireSignIn, createJobController);
router.put("/update/:id", requireSignIn, updateJobController);
router.delete("/delete/:id", requireSignIn, deleteJobController);

// Get current user's jobs
router.get("/get", requireSignIn, getJobsController);
router.get("/get-jobs", requireSignIn, getAllJobsController);
router.get("/search", searchJobsController);

// ✅ Specific route must come BEFORE /:id
router.get("/my-jobs", requireSignIn, getRecruiterJobsController);

// ❗ Place this last so it doesn't override all other routes
router.get("/single/:id",  getSingleJobController);

export default router;
