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

export const ProjectRoutes = router;