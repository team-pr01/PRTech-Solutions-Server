import express from "express";
import { ScheduledCallController } from "./scheduledCall.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Public route - Schedule a call
router.post(
  "/schedule",
  ScheduledCallController.scheduleCall
);

// Admin routes
router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  ScheduledCallController.getAllScheduledCalls
);

router.get(
  "/statistics",
  auth(UserRole.admin, UserRole.staff),
  ScheduledCallController.getScheduledCallStatistics
);

router.get(
  "/:callId",
  auth(UserRole.admin, UserRole.staff),
  ScheduledCallController.getSingleScheduledCall
);

router.put(
  "/update/:callId",
  auth(UserRole.admin, UserRole.staff),
  ScheduledCallController.updateScheduledCall
);

router.delete(
  "/delete/:callId",
  auth(UserRole.admin, UserRole.staff),
  ScheduledCallController.deleteScheduledCall
);

export const ScheduledCallRoutes = router;