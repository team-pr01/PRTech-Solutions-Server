import httpStatus from "http-status";
import { BlogServices } from "./blog.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Add blog (Admin)
const addBlog = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  const result = await BlogServices.addBlog(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog added successfully",
    data: result,
  });
});

// Get all blogs (Search & Filter)
const getAllBlogs = catchAsync(async (req, res) => {
  const { keyword, category, skip, limit } = req.query;

  const result = await BlogServices.getAllBlogs(
    keyword as string,
    category as string,
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs fetched successfully",
    data: result,
  });
});

// Get single blog by ID
const getSingleBlogById = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const result = await BlogServices.getSingleBlogById(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result,
  });
});

// Get single blog by slug
const getSingleBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const result = await BlogServices.getSingleBlogBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result,
  });
});


// Update blog
const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const file = req.file as Express.Multer.File;

  const result = await BlogServices.updateBlog(blogId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

// Delete blog
const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const result = await BlogServices.deleteBlog(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

// Mark blog as featured
const markAsFeatured = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.markAsFeatured(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result?.isFeatured ? "Blog marked as featured" : "Blog unmarked as featured",
    data: result,
  });
});

export const BlogControllers = {
  addBlog,
  getAllBlogs,
  getSingleBlogById,
  getSingleBlogBySlug,
  updateBlog,
  deleteBlog,
  markAsFeatured
};
