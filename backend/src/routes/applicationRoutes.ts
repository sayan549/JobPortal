// routes/applicationRoutes.ts
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware";
import { applyToJob, getAppliedJobs, getRecruiterApplications } from "../controllers/applicationController";

const router = express.Router();

router.post("/apply", requireSignIn, applyToJob);
router.get("/seeker", requireSignIn, getAppliedJobs);
router.get("/recruiter", requireSignIn, getRecruiterApplications);

export default router;
