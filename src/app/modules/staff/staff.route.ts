import express from "express";
import { StaffController } from "./staff.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.get("/", auth(UserRole.admin), StaffController.getAllStaffs);
router.get("/:id", auth(UserRole.admin), StaffController.getSingleStaff);
router.patch("/update/:id", auth(UserRole.admin), StaffController.updateStaff);
router.delete("/delete/:id", auth(UserRole.admin), StaffController.deleteStaff);

export const StaffRoutes = router;
