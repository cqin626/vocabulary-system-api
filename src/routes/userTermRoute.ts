import express from "express";
import { userTermManagementController } from "../features/userTermManagement/userTermManagementController.js";
import { verifyAuthentication } from "../middleware/accessVerifier.js";

const router = express.Router();

router.use(verifyAuthentication);

router
  .route("/")
  .get(userTermManagementController.getUserTermsWithTermDetails)
  .post(userTermManagementController.addUserTerm)
  .put(userTermManagementController.updateUserTermFamiliarity)
  .delete(userTermManagementController.deleteUserTerm);

router
  .route("/:text")
  .get(userTermManagementController.getTermWithUserTermDetails);

export default router;
