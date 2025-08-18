// src/routes/statsRoutes.ts
import express from "express";
import { getStatsController } from "../controllers/statsController";
import { requireSignIn } from "../middlewares/authMiddleware";

const router = express.Router();

// GET /api/v1/stats
router.get("/", requireSignIn, getStatsController);

export default router;
