"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_controller_1 = require("./client.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.addClient);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.getAllClients);
router.get("/:clientId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.getSingleClient);
router.put("/update/:clientId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.updateClient);
router.delete("/delete/:clientId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.deleteClient);
// Subordinate Routes
router.post("/:clientId/subordinate/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.addSubordinate);
router.put("/:clientId/subordinate/update/:subordinateId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.updateSubordinate);
router.delete("/:clientId/subordinate/delete/:subordinateId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), client_controller_1.ClientControllers.deleteSubordinate);
exports.ClientRoutes = router;
