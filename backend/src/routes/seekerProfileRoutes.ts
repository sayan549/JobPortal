import express from "express";
import multer from "multer";
import { updateSeekerProfileController,getSeekerProfileController,getAllSeekerProfilesController,getSeekerProfileByIdController } from "../controllers/seekerProfileController";
import { requireSignIn } from "../middlewares/authMiddleware";

const router = express.Router();

// Multer config (store in uploads/)
const upload = multer({ dest: "uploads/" });

// ✅ GET profile
router.get("/profile", requireSignIn, getSeekerProfileController);

router.post("/update-profile", requireSignIn,upload.single("resume"), updateSeekerProfileController);


// ✅ Recruiter routes
router.get("/all-seekers", requireSignIn, getAllSeekerProfilesController); 
router.get("/seeker/:id", requireSignIn, getSeekerProfileByIdController);

export default router;
