"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoutes = void 0;
const express_1 = __importDefault(require("express"));
const staff_controller_1 = require("./staff.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin), staff_controller_1.StaffController.getAllStaffs);
router.get("/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin), staff_controller_1.StaffController.getSingleStaff);
router.patch("/update/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin), staff_controller_1.StaffController.updateStaff);
router.delete("/delete/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin), staff_controller_1.StaffController.deleteStaff);
exports.StaffRoutes = router;
