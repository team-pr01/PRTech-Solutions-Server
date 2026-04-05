"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const express_1 = __importDefault(require("express"));
const accounts_controller_1 = require("./accounts.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.addAccount);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.getAllAccounts);
router.get("/summary", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.getAccountSummary);
router.get("/:accountId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.getSingleAccount);
router.put("/update/:accountId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.updateAccount);
router.delete("/delete/:accountId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), accounts_controller_1.AccountControllers.deleteAccount);
exports.AccountRoutes = router;
