import express from "express";
import { BlogControllers } from "./blog.controller";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Add Blog (Admin / Moderator)
router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  multerUpload.single("file"),
  BlogControllers.addBlog
);

// Get All Blogs
router.get("/", BlogControllers.getAllBlogs);

// Get Single Blog by ID
router.get("/:blogId", BlogControllers.getSingleBlogById);
router.get("/slug/:slug", BlogControllers.getSingleBlogBySlug);

// Update Blog
router.put(
  "/update/:blogId",
  auth(UserRole.admin, UserRole.staff),
  multerUpload.single("file"),
  BlogControllers.updateBlog
);

// Delete Blog
router.delete(
  "/delete/:blogId",
  auth(UserRole.admin, UserRole.staff),
  BlogControllers.deleteBlog
);

router.patch(
  "/mark-featured/:id",
  auth(UserRole.admin, UserRole.staff),
  BlogControllers.markAsFeatured
);

export const BlogRoutes = router;
