import express from "express";
import { userTermManagementController } from "../features/userTermManagement/userTermManagementController.js";
import { verifyAuthentication } from "../middleware/accessVerifier.js";

const router = express.Router();

router.use(verifyAuthentication);

router.route("/").post(userTermManagementController.addUserTerm);
router
  .route("/:text")
  .get(userTermManagementController.getTermWithUserTermDetails);

export default router;
