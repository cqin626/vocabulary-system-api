import express from "express";
import { authController } from "../features/auth/authController.js";

const router = express.Router();

router.route("/registration").post(authController.registerUser);

export default router;
