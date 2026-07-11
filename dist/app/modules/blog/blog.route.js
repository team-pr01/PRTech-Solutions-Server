"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Add Blog (Admin / Moderator)
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), multer_config_1.multerUpload.single("file"), blog_controller_1.BlogControllers.addBlog);
// Get All Blogs
router.get("/", blog_controller_1.BlogControllers.getAllBlogs);
// Get Single Blog by ID
router.get("/:blogId", blog_controller_1.BlogControllers.getSingleBlogById);
router.get("/slug/:slug", blog_controller_1.BlogControllers.getSingleBlogBySlug);
// Update Blog
router.put("/update/:blogId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), multer_config_1.multerUpload.single("file"), blog_controller_1.BlogControllers.updateBlog);
// Delete Blog
router.delete("/delete/:blogId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), blog_controller_1.BlogControllers.deleteBlog);
router.patch("/mark-featured/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), blog_controller_1.BlogControllers.markAsFeatured);
exports.BlogRoutes = router;
