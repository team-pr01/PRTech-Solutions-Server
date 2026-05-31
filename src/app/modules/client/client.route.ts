import express from "express";
import { ClientControllers } from "./client.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.addClient
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.getAllClients
);

router.get(
  "/subordinates/:clientId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.getSubordinatesByClientId
);

router.get(
  "/:clientId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.getSingleClient
);

router.put(
  "/update/:clientId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.updateClient
);

router.delete(
  "/delete/:clientId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.deleteClient
);

// Add gift to client
router.post(
  "/gifts/add/:clientId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.addGift
);

// Subordinate Routes
router.post(
  "/:clientId/subordinate/add",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.addSubordinate
);

router.put(
  "/:clientId/subordinate/update/:subordinateId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.updateSubordinate
);

router.delete(
  "/:clientId/subordinate/delete/:subordinateId",
  auth(UserRole.admin, UserRole.staff),
  ClientControllers.deleteSubordinate
);

export const ClientRoutes = router;