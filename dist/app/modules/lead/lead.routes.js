"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lead_controller_1 = require("./lead.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Lead CRUD Operations
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.addLead);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.getAllLeads);
router.get("/statistics", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.getLeadStatistics);
router.get("/:leadId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.getSingleLead);
router.put("/update/:leadId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.updateLead);
router.delete("/delete/:leadId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.deleteLead);
// Schedule Discovery Call
router.put("/schedule-discovery-call/:leadId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.scheduleDiscoveryCall);
// Follow Up Routes
router.post("/:leadId/follow-ups/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.addFollowUp);
router.delete("/:leadId/follow-ups/delete/:followUpId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), lead_controller_1.LeadControllers.deleteFollowUp);
exports.LeadRoutes = router;
