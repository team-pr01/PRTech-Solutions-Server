"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicheRoutes = void 0;
const express_1 = __importDefault(require("express"));
const niche_controller_1 = require("./niche.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Add niche (admin only)
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin), niche_controller_1.NicheController.addNiche);
// Get all niches
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin), niche_controller_1.NicheController.getAllNiches);
// Get a single niche by ID
router.get("/:nicheId", (0, auth_1.default)(auth_constants_1.UserRole.admin), niche_controller_1.NicheController.getSingleNicheById);
// Update niche by ID (admin only)
router.put("/update/:nicheId", (0, auth_1.default)(auth_constants_1.UserRole.admin), niche_controller_1.NicheController.updateNiche);
// Delete niche by ID (admin only)
router.delete("/delete/:nicheId", (0, auth_1.default)(auth_constants_1.UserRole.admin), niche_controller_1.NicheController.deleteNiche);
exports.NicheRoutes = router;
