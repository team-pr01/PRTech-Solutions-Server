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
exports.ProjectRoutes = router;
