import express from "express";
import { CalendarController } from "./calendar.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Add meeting
router.post(
  "/add-meeting",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.addMeeting
);

// Get my calendar meetings
router.get(
  "/my",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.getMyCalendar
);

// Get single meeting
router.get(
  "/:meetingId",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.getSingleMeeting
);

// Update meeting
router.put(
  "/update-meeting/:meetingId",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.updateMeeting
);

// Update meeting status
router.patch(
  "/update-status/:meetingId",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.updateMeetingStatus
);

// Delete meeting
router.delete(
  "/delete/:meetingId",
  auth(UserRole.admin, UserRole.staff),
  CalendarController.deleteMeeting
);

export const CalendarRoutes = router;