import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
   getProfileController,
  updateProfileController,
} from "../controllers/authController";
import { requireSignIn } from "../middlewares/authMiddleware";

const router = express.Router();

// Existing routes...
router.post("/register", registerController);
router.post("/login", loginController);

// ✅ Protected route
router.get("/current-user", requireSignIn, currentUserController);

router.get("/profile", requireSignIn, getProfileController);
router.put("/update-profile", requireSignIn, updateProfileController);




export default router;
