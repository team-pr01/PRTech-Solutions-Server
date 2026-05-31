import express from "express";
import { QueryController } from "./query.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Public routes (with authentication)
router.post(
  "/raise",
  auth(UserRole.admin, UserRole.staff, UserRole.user, UserRole.client),
  QueryController.raiseQuery
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  QueryController.getAllQueries
);

router.get(
  "/my-queries",
  auth(UserRole.user, UserRole.admin, UserRole.client),
  QueryController.getMyQueries
);

router.get(
  "/user/:userId",
  auth(UserRole.admin, UserRole.staff),
  QueryController.getQueriesByUser
);

router.get(
  "/:queryId",
  auth(UserRole.admin, UserRole.staff),
  QueryController.getSingleQuery
);

router.patch(
  "/update-status/:queryId",
  auth(UserRole.admin, UserRole.staff),
  QueryController.updateQueryStatus
);

router.patch(
  "/answer/:queryId",
  auth(UserRole.admin, UserRole.staff),
  QueryController.answerQuery
);

router.delete(
  "/delete/:queryId",
  auth(UserRole.admin, UserRole.staff),
  QueryController.deleteQuery
);

export const QueryRoutes = router;