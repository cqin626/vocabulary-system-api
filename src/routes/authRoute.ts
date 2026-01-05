import express from "express";
import { authController } from "../features/auth/authController.js";

const router = express.Router();

router.route("/registration").post(authController.registerUser);
router.route("/login").post(authController.handleLogin);
router.route("/logout").post(authController.handleLogout);
router.route("/refresh").post(authController.refresh);

export default router;
