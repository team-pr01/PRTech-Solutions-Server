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
exports.IssueServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const issue_model_1 = __importDefault(require("./issue.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
// Raise a new issue
const raiseIssue = (userId, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, priority } = payload;
    // Upload images to Cloudinary
    let imageUrls = [];
    if (files && files.length > 0) {
        const uploads = files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () {
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(`issue-${Date.now()}-${index}`, file.path);
            return secure_url;
        }));
        imageUrls = yield Promise.all(uploads);
    }
    const issueData = {
        title,
        description,
        priority: priority || "medium",
        status: "pending",
        images: imageUrls,
        raisedBy: userId,
        project: payload.project,
    };
    const result = yield issue_model_1.default.create(issueData);
    return result;
});
// Get all issues with filters and pagination
const getAllIssues = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (title, description)
    if (filters.keyword) {
        query.$or = [
            { title: { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = filters.status;
    }
    // PRIORITY FILTER
    if (filters.priority) {
        query.priority = filters.priority;
    }
    // RAISED BY FILTER
    if (filters.raisedBy) {
        query.raisedBy = filters.raisedBy;
    }
    // PROJECT FILTER
    if (filters.projectId) {
        query.projectId = filters.projectId;
    }
    // DATE RANGE FILTER
    if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
            query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
            query.createdAt.$lte = new Date(filters.dateTo);
        }
    }
    // Get paginated data with custom population
    const result = yield (0, infinitePaginate_1.infinitePaginate)(issue_model_1.default, query, skip, limit, [] // Empty array to handle population manually
    );
    // Manually populate with specific fields
    const populatedData = yield issue_model_1.default.populate(result.data, [
        {
            path: "project",
            select: "name _id"
        },
        {
            path: "raisedBy",
            select: "name email _id"
        }
    ]);
    return Object.assign(Object.assign({}, result), { data: populatedData });
});
// Get single issue by ID
const getSingleIssue = (issueId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield issue_model_1.default.findById(issueId).populate([
        {
            path: "raisedBy",
            select: "name email _id"
        },
        {
            path: "project",
            select: "name _id"
        }
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Issue not found");
    }
    return result;
});
// Get my raised issues (for logged-in user)
const getMyRaisedIssues = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}, skip = 0, limit = 10) {
    var _a, _b, _c, _d, _e;
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    const query = { raisedBy: userId };
    // SEARCH (title, description)
    if (filters.keyword) {
        query.$or = [
            { title: { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = filters.status;
    }
    // PRIORITY FILTER
    if (filters.priority) {
        query.priority = filters.priority;
    }
    // DATE RANGE FILTER
    if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
            query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
            query.createdAt.$lte = new Date(filters.dateTo);
        }
    }
    // Get paginated data
    const paginatedData = yield (0, infinitePaginate_1.infinitePaginate)(issue_model_1.default, query, skip, limit, []);
    // Apply filters to stats (but keep them separate for different stats)
    // For total counts, we need different queries
    // Get total counts without status filter
    const totalStats = yield issue_model_1.default.aggregate([
        { $match: { raisedBy: objectId } }, // Use ObjectId here
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                ongoing: { $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
                byPriority: {
                    $push: "$priority"
                }
            }
        }
    ]);
    const populatedData = yield issue_model_1.default.populate(paginatedData.data, [
        {
            path: "project",
            select: "name _id"
        },
        {
            path: "raisedBy",
            select: "name email _id"
        }
    ]);
    return {
        data: populatedData,
        meta: paginatedData.meta,
        stats: {
            total: ((_a = totalStats[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            pending: ((_b = totalStats[0]) === null || _b === void 0 ? void 0 : _b.pending) || 0,
            ongoing: ((_c = totalStats[0]) === null || _c === void 0 ? void 0 : _c.ongoing) || 0,
            answered: ((_d = totalStats[0]) === null || _d === void 0 ? void 0 : _d.answered) || 0,
            closed: ((_e = totalStats[0]) === null || _e === void 0 ? void 0 : _e.closed) || 0,
        },
        populatedData
    };
});
// Update issue status
const updateIssueStatus = (issueId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const issue = yield issue_model_1.default.findById(issueId);
    if (!issue) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Issue not found");
    }
    const updateData = { status };
    // If status is answered, set answeredAt date
    if (status === "answered") {
        updateData.resolvedAt = new Date();
    }
    const result = yield issue_model_1.default.findByIdAndUpdate(issueId, updateData, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete issue
const deleteIssue = (issueId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield issue_model_1.default.findByIdAndDelete(issueId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Issue not found");
    }
    return result;
});
// Get issue statistics
const getIssueStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const stats = yield issue_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                ongoing: { $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] } },
                answered: { $sum: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
                byPriority: {
                    $push: "$priority"
                }
            }
        }
    ]);
    const byPriority = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
    };
    if (stats[0]) {
        (_a = stats[0].byPriority) === null || _a === void 0 ? void 0 : _a.forEach((priority) => {
            byPriority[priority]++;
        });
    }
    return {
        total: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
        pending: ((_c = stats[0]) === null || _c === void 0 ? void 0 : _c.pending) || 0,
        ongoing: ((_d = stats[0]) === null || _d === void 0 ? void 0 : _d.ongoing) || 0,
        answered: ((_e = stats[0]) === null || _e === void 0 ? void 0 : _e.answered) || 0,
        closed: ((_f = stats[0]) === null || _f === void 0 ? void 0 : _f.closed) || 0,
        byPriority
    };
});
exports.IssueServices = {
    raiseIssue,
    getAllIssues,
    getSingleIssue,
    getMyRaisedIssues,
    updateIssueStatus,
    deleteIssue,
    getIssueStatistics,
};
