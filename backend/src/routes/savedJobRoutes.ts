// routes/savedJobRoutes.ts
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware";
import {
  saveJobController,
  getSavedJobsController,
  deleteSavedJobController,
} from "../controllers/savedJobController";

const router = express.Router();

router.post("/save", requireSignIn, saveJobController);
router.get("/my", requireSignIn, getSavedJobsController);
router.delete("/:id", requireSignIn, deleteSavedJobController);

export default router;
