"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledCallRoutes = void 0;
const express_1 = __importDefault(require("express"));
const scheduledCall_controller_1 = require("./scheduledCall.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Public route - Schedule a call
router.post("/schedule", scheduledCall_controller_1.ScheduledCallController.scheduleCall);
// Admin routes
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), scheduledCall_controller_1.ScheduledCallController.getAllScheduledCalls);
router.get("/statistics", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), scheduledCall_controller_1.ScheduledCallController.getScheduledCallStatistics);
router.get("/:callId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), scheduledCall_controller_1.ScheduledCallController.getSingleScheduledCall);
router.put("/update/:callId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), scheduledCall_controller_1.ScheduledCallController.updateScheduledCall);
router.delete("/delete/:callId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), scheduledCall_controller_1.ScheduledCallController.deleteScheduledCall);
exports.ScheduledCallRoutes = router;
