import express from "express";
import { termManagementController } from "../features/termManagement/termManagementController.js";

const router = express.Router();

router
  .route("/")
  .get(termManagementController.getTerms)
  .post(termManagementController.insertTerm);

router.route("/:text").get(termManagementController.getTermByText);

export default router;
