import express from "express";
import termRouter from "./termRoute.js";

const router = express.Router();

router.use("/terms", termRouter);

export default router;
