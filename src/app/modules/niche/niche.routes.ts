import express from "express";
import { NicheController } from "./niche.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Add niche (admin only)
router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  NicheController.addNiche
);

// Get all niches
router.get("/", auth(UserRole.admin, UserRole.staff), NicheController.getAllNiches);

// Get a single niche by ID
router.get("/:nicheId", auth(UserRole.admin, UserRole.staff), NicheController.getSingleNicheById);

// Update niche by ID (admin only)
router.put(
  "/update/:nicheId",
  auth(UserRole.admin, UserRole.staff),
  NicheController.updateNiche
);

// Delete niche by ID (admin only)
router.delete(
  "/delete/:nicheId",
  auth(UserRole.admin, UserRole.staff),
  NicheController.deleteNiche
);

export const NicheRoutes = router;