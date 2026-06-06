"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRoutes = void 0;
const express_1 = __importDefault(require("express"));
const calendar_controller_1 = require("./calendar.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Add meeting
router.post("/add-meeting", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.addMeeting);
// Get my calendar meetings
router.get("/my", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.getMyCalendar);
// Get single meeting
router.get("/:meetingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.getSingleMeeting);
// Update meeting
router.put("/update/:meetingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.updateMeeting);
// Update meeting status
router.patch("/update-status/:meetingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.updateMeetingStatus);
// Delete meeting
router.delete("/delete/:meetingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), calendar_controller_1.CalendarController.deleteMeeting);
exports.CalendarRoutes = router;
