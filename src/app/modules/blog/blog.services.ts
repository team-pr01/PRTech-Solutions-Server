/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Blog from "./blog.model";
import { TBlog } from "./blog.interface";
import { v2 as cloudinary } from "cloudinary";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import AppError from "../../errors/AppError";
import { infinitePaginate } from "../../utils/infinitePaginate";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Blog (Admin)
const addBlog = async (
  payload: TBlog,
  file?: Express.Multer.File
) => {
  let imageUrl = "";

  if (file) {
    const uploadedImage = await sendImageToCloudinary(
      file.originalname,
      file.path
    );
    imageUrl = uploadedImage.secure_url;
  }

  const payloadData = {
    ...payload,
    imageUrl,
  };

  const result = await Blog.create(payloadData);
  return result;
};

// Get All Blogs (Search + Filter)
const getAllBlogs = async (
  keyword?: string,
  category?: string,
  skip = 0,
  limit = 10
) => {
  const query: any = {};

  // Keyword search (title, overview, description)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { overview: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  return infinitePaginate(
    Blog,
    query,
    skip,
    limit,
    []
  );
};

// Get Single Blog by ID
const getSingleBlogById = async (id: string) => {
  const result = await Blog.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  return result;
};

// Get Single Blog by Slug
const getSingleBlogBySlug = async (slug: string) => {
  const result = await Blog.findOne({ slug });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  return result;
};


// Update Blog
const updateBlog = async (
  id: string,
  payload: Partial<TBlog>,
  file?: Express.Multer.File
) => {
  const existingBlog = await Blog.findById(id);

  if (!existingBlog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  let imageUrl: string | undefined;

  // Upload new image if provided
  if (file) {
    const uploadedImage = await sendImageToCloudinary(
      file.originalname,
      file.path
    );
    imageUrl = uploadedImage.secure_url;

    // Delete old image from Cloudinary
    if (existingBlog.imageUrl) {
      try {
        const parts = existingBlog.imageUrl.split("/");
        const filename = parts[parts.length - 1];
        const publicId = decodeURIComponent(filename.split(".")[0]);
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete old blog image:", err);
      }
    }
  }

  const updatePayload: Partial<TBlog> = {
    ...payload,
    ...(imageUrl && { imageUrl }),
  };

  const result = await Blog.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete Blog
const deleteBlog = async (id: string) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  // Delete blog image from Cloudinary
  if (blog.imageUrl) {
    try {
      const parts = blog.imageUrl.split("/");
      const filename = parts[parts.length - 1];
      const publicId = decodeURIComponent(filename.split(".")[0]);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Error deleting blog image:", err);
    }
  }

  const result = await Blog.findByIdAndDelete(id);
  return result;
};

const markAsFeatured = async (id: string) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  // Toggle featured status
  const newFeaturedStatus = !blog.isFeatured;

  // If marking as featured, remove featured status from other blogs (optional)
  if (newFeaturedStatus) {
    // Remove featured status from all other blogs (if you want only one featured blog)
    await Blog.updateMany(
      { _id: { $ne: id } },
      { isFeatured: false }
    );
  }

  const result = await Blog.findByIdAndUpdate(
    id,
    { isFeatured: newFeaturedStatus },
    { new: true, runValidators: true }
  );

  return result;
};

export const BlogServices = {
  addBlog,
  getAllBlogs,
  getSingleBlogById,
  getSingleBlogBySlug,
  updateBlog,
  deleteBlog,
  markAsFeatured
};
