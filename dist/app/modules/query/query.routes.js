"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const query_controller_1 = require("./query.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Public routes (with authentication)
router.post("/raise", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.user, auth_constants_1.UserRole.client), query_controller_1.QueryController.raiseQuery);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.getAllQueries);
router.get("/my-queries", (0, auth_1.default)(auth_constants_1.UserRole.user, auth_constants_1.UserRole.admin, auth_constants_1.UserRole.client), query_controller_1.QueryController.getMyQueries);
router.get("/user/:userId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.getQueriesByUser);
router.get("/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.getSingleQuery);
router.patch("/update-status/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.updateQueryStatus);
router.patch("/answer/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.answerQuery);
router.delete("/delete/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), query_controller_1.QueryController.deleteQuery);
exports.QueryRoutes = router;
