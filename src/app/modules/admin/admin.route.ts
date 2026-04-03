import express from "express";
import { AdminStatsController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.get("/overview", auth(UserRole.admin), AdminStatsController.getPlatformOverview);

export const AdminRoutes = router;