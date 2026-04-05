import express from "express";
import { AccountControllers } from "./accounts.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.addAccount
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.getAllAccounts
);

router.get(
  "/summary",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.getAccountSummary
);

router.get(
  "/:accountId",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.getSingleAccount
);

router.put(
  "/update/:accountId",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.updateAccount
);

router.delete(
  "/delete/:accountId",
  auth(UserRole.admin, UserRole.staff),
  AccountControllers.deleteAccount
);

export const AccountRoutes = router;