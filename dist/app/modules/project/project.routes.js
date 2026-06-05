"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Project CRUD Operations
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.addProject);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.getAllProjects);
router.get("/:projectId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.getSingleProject);
router.put("/update/:projectId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.updateProject);
router.delete("/delete/:projectId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.deleteProject);
// Phase Management Routes
router.post("/phases/add/:projectId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.addPhase);
router.get("/phases/:projectId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.getAllPhases);
router.get("/phases/:projectId/:phaseId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.getSinglePhase);
router.put("/phases/update/:projectId/:phaseId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.updatePhase);
// Installment Management Routes
router.post("/:projectId/phases/:phaseId/installments/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.addInstallment);
router.put("/:projectId/phases/:phaseId/installments/update/:installmentId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.updateInstallment);
// router.delete(
//   "/:projectId/phases/:phaseId/installments/delete/:installmentId",
//   auth(UserRole.admin, UserRole.staff),
//   ProjectControllers.deleteInstallment
// );
router.post("/:projectId/expenditure/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.addExpenditure);
// Add phase to expenditure
router.post("/:projectId/expenditure/:expenditureId/phases/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.addPhaseToExpenditure);
router.delete("/phases/delete/:projectId/:phaseId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), project_controller_1.ProjectControllers.deletePhase);
router.get("/client/my-projects", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.client, auth_constants_1.UserRole.user), project_controller_1.ProjectControllers.getProjectsByClientId);
exports.ProjectRoutes = router;
