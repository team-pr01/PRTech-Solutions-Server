import express from "express";
import { LeadControllers } from "./lead.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Lead CRUD Operations
router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.addLead
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.getAllLeads
);

router.get(
  "/statistics",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.getLeadStatistics
);

router.get(
  "/:leadId",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.getSingleLead
);

router.put(
  "/update/:leadId",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.updateLead
);

router.delete(
  "/delete/:leadId",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.deleteLead
);

// Follow Up Routes
router.post(
  "/:leadId/follow-ups/add",
  auth(UserRole.admin, UserRole.staff),
  LeadControllers.addFollowUp
);

export const LeadRoutes = router;