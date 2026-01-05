import express from "express";
import { termManagementController } from "../features/termManagement/termManagementController.js";
import { verifyAuthentication } from "../middleware/accessVerifier.js";

const router = express.Router();

router.use(verifyAuthentication);

router
  .route("/")
  .get(termManagementController.getTerms)
  .post(termManagementController.insertTerm);

router.route("/:text").get(termManagementController.getTermByText);

export default router;
