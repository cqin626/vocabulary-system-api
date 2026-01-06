import express from "express";
import termRouter from "./termRoute.js";
import authRouter from "./authRoute.js";
import userTermManagementRouter from "./userTermRoute.js";

const router = express.Router();

router.use("/terms", termRouter);
router.use("/auth", authRouter);
router.use("/user-terms", userTermManagementRouter);

export default router;
