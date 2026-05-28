import express from "express";
import { IssueController } from "./issue.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Raise a new issue (with image upload - max 4 images)
router.post(
  "/raise",
  auth(UserRole.admin, UserRole.staff, UserRole.user),
  multerUpload.array("files", 4),
  IssueController.raiseIssue
);

// Get all issues
router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  IssueController.getAllIssues
);

// Get issue statistics
router.get(
  "/statistics",
  auth(UserRole.admin, UserRole.staff),
  IssueController.getIssueStatistics
);

// Get my raised issues
router.get(
  "/my-issues",
  auth(UserRole.admin, UserRole.staff, UserRole.user),
  IssueController.getMyRaisedIssues
);

// Get single issue
router.get(
  "/:issueId",
  auth(UserRole.admin, UserRole.staff, UserRole.user),
  IssueController.getSingleIssue
);

// Update issue status
router.patch(
  "/update-status/:issueId",
  auth(UserRole.admin, UserRole.staff),
  IssueController.updateIssueStatus
);

// Delete issue
router.delete(
  "/delete/:issueId",
  auth(UserRole.admin, UserRole.staff),
  IssueController.deleteIssue
);

export const IssueRoutes = router;