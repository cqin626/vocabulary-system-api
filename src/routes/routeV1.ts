import express from "express";
import termRouter from "./termRoute.js";
import authRouter from "./authRoute.js";

const router = express.Router();

router.use("/terms", termRouter);
router.use("/auth", authRouter);

export default router;
