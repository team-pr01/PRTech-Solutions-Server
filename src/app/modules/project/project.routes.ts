import express from "express";
import { ProjectControllers } from "./project.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Project CRUD Operations
router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.addProject
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.getAllProjects
);

router.get(
  "/:projectId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.getSingleProject
);

router.put(
  "/update/:projectId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.updateProject
);

router.delete(
  "/delete/:projectId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.deleteProject
);

// Phase Management Routes
router.post(
  "/phases/add/:projectId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.addPhase
);

router.get(
  "/phases/:projectId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.getAllPhases
);

router.get(
  "/phases/:projectId/:phaseId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.getSinglePhase
);

router.put(
  "/phases/update/:projectId/:phaseId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.updatePhase
);


// Installment Management Routes
router.post(
  "/:projectId/phases/:phaseId/installments/add",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.addInstallment
);

router.put(
  "/:projectId/phases/:phaseId/installments/update/:installmentId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.updateInstallment
);

// router.delete(
//   "/:projectId/phases/:phaseId/installments/delete/:installmentId",
//   auth(UserRole.admin, UserRole.staff),
//   ProjectControllers.deleteInstallment
// );

router.post(
  "/:projectId/expenditure/add",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.addExpenditure
);

// Add phase to expenditure
router.post(
  "/:projectId/expenditure/:expenditureId/phases/add",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.addPhaseToExpenditure
);


router.delete(
  "/phases/delete/:projectId/:phaseId",
  auth(UserRole.admin, UserRole.staff),
  ProjectControllers.deletePhase
);

router.get(
  "/client/:clientId",
  auth(UserRole.admin, UserRole.staff, UserRole.client, UserRole.user),
  ProjectControllers.getProjectsByClientId
);

export const ProjectRoutes = router;