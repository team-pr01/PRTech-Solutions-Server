"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const issue_controller_1 = require("./issue.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Raise a new issue (with image upload - max 4 images)
router.post("/raise", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.user, auth_constants_1.UserRole.client), multer_config_1.multerUpload.array("files", 4), issue_controller_1.IssueController.raiseIssue);
// Get all issues
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), issue_controller_1.IssueController.getAllIssues);
// Get issue statistics
router.get("/statistics", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), issue_controller_1.IssueController.getIssueStatistics);
// Get my raised issues
router.get("/my-issues", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.user, auth_constants_1.UserRole.client), issue_controller_1.IssueController.getMyRaisedIssues);
// Get single issue
router.get("/:issueId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.user, auth_constants_1.UserRole.client), issue_controller_1.IssueController.getSingleIssue);
// Update issue status
router.patch("/update-status/:issueId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), issue_controller_1.IssueController.updateIssueStatus);
// Delete issue
router.delete("/delete/:issueId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), issue_controller_1.IssueController.deleteIssue);
exports.IssueRoutes = router;
