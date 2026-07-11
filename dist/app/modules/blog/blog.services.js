"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const blog_model_1 = __importDefault(require("./blog.model"));
const cloudinary_1 = require("cloudinary");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Add Blog (Admin)
const addBlog = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl = "";
    if (file) {
        const uploadedImage = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path);
        imageUrl = uploadedImage.secure_url;
    }
    const payloadData = Object.assign(Object.assign({}, payload), { imageUrl, tags: Array.isArray(payload.tags)
            ? payload.tags
            : payload.tags
                ? JSON.parse(payload.tags)
                : [] });
    const result = yield blog_model_1.default.create(payloadData);
    return result;
});
// Get All Blogs (Search + Filter)
const getAllBlogs = (keyword_1, category_1, ...args_1) => __awaiter(void 0, [keyword_1, category_1, ...args_1], void 0, function* (keyword, category, skip = 0, limit = 10) {
    const query = {};
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
    return (0, infinitePaginate_1.infinitePaginate)(blog_model_1.default, query, skip, limit, []);
});
// Get Single Blog by ID
const getSingleBlogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    return result;
});
// Get Single Blog by Slug
const getSingleBlogBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.default.findOne({ slug });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    return result;
});
// Update Blog
const updateBlog = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield blog_model_1.default.findById(id);
    if (!existingBlog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    let imageUrl;
    // Upload new image if provided
    if (file) {
        const uploadedImage = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path);
        imageUrl = uploadedImage.secure_url;
        // Delete old image from Cloudinary
        if (existingBlog.imageUrl) {
            try {
                const parts = existingBlog.imageUrl.split("/");
                const filename = parts[parts.length - 1];
                const publicId = decodeURIComponent(filename.split(".")[0]);
                yield cloudinary_1.v2.uploader.destroy(publicId);
            }
            catch (err) {
                console.error("Failed to delete old blog image:", err);
            }
        }
    }
    const updatePayload = Object.assign(Object.assign({}, payload), (imageUrl && { imageUrl }));
    const result = yield blog_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete Blog
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.default.findById(id);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    // Delete blog image from Cloudinary
    if (blog.imageUrl) {
        try {
            const parts = blog.imageUrl.split("/");
            const filename = parts[parts.length - 1];
            const publicId = decodeURIComponent(filename.split(".")[0]);
            yield cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (err) {
            console.error("Error deleting blog image:", err);
        }
    }
    const result = yield blog_model_1.default.findByIdAndDelete(id);
    return result;
});
const markAsFeatured = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.default.findById(id);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    // Toggle featured status
    const newFeaturedStatus = !blog.isFeatured;
    // If marking as featured, remove featured status from other blogs (optional)
    if (newFeaturedStatus) {
        // Remove featured status from all other blogs (if you want only one featured blog)
        yield blog_model_1.default.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }
    const result = yield blog_model_1.default.findByIdAndUpdate(id, { isFeatured: newFeaturedStatus }, { new: true, runValidators: true });
    return result;
});
exports.BlogServices = {
    addBlog,
    getAllBlogs,
    getSingleBlogById,
    getSingleBlogBySlug,
    updateBlog,
    deleteBlog,
    markAsFeatured
};
