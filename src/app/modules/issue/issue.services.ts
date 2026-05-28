/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Issue from "./issue.model";
import { infinitePaginate } from "../../utils/infinitePaginate";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import mongoose from "mongoose";

// Raise a new issue
const raiseIssue = async (
    userId: string,
    payload: any,
    files: Express.Multer.File[]
) => {
    const { title, description, priority } = payload;

    // Upload images to Cloudinary
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
        const uploads = files.map(async (file, index) => {
            const { secure_url } = await sendImageToCloudinary(
                `issue-${Date.now()}-${index}`,
                file.path
            );
            return secure_url;
        });

        imageUrls = await Promise.all(uploads);
    }

    const issueData = {
        title,
        description,
        priority: priority || "medium",
        status: "pending",
        images: imageUrls,
        raisedBy: userId,
    };

    const result = await Issue.create(issueData);
    return result;
};

// Get all issues with filters and pagination
const getAllIssues = async (
    filters: any = {},
    skip = 0,
    limit = 10
) => {
    const query: any = {};

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

    return infinitePaginate(
        Issue,
        query,
        skip,
        limit,
        ["raisedBy"]
    );
};

// Get single issue by ID
const getSingleIssue = async (issueId: string) => {
    const result = await Issue.findById(issueId).populate("raisedBy", "name email");
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Issue not found");
    }
    return result;
};

// Get my raised issues (for logged-in user)
const getMyRaisedIssues = async (
    userId: string,
    filters: any = {},
    skip = 0,
    limit = 10
) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    const query: any = { raisedBy: userId };

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
    const paginatedData = await infinitePaginate(
        Issue,
        query,
        skip,
        limit,
        ["raisedBy"]
    );
    
    // Apply filters to stats (but keep them separate for different stats)
    // For total counts, we need different queries
    
    // Get total counts without status filter
      const totalStats = await Issue.aggregate([
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

    console.log(totalStats);

    return {
        data: paginatedData.data,
        meta: paginatedData.meta,
        stats: {
            total: totalStats[0]?.total || 0,
            pending: totalStats[0]?.pending || 0,
            ongoing: totalStats[0]?.ongoing || 0,
            answered: totalStats[0]?.answered || 0,
            closed: totalStats[0]?.closed || 0,
        }
    };
};

// Update issue status
const updateIssueStatus = async (
    issueId: string,
    status: "pending" | "ongoing" | "answered" | "closed"
) => {
    const issue = await Issue.findById(issueId);
    if (!issue) {
        throw new AppError(httpStatus.NOT_FOUND, "Issue not found");
    }

    const updateData: any = { status };

    // If status is answered, set answeredAt date
    if (status === "answered") {
        updateData.resolvedAt = new Date();
    }

    const result = await Issue.findByIdAndUpdate(issueId, updateData, {
        new: true,
        runValidators: true,
    });

    return result;
};

// Delete issue
const deleteIssue = async (issueId: string) => {
    const result = await Issue.findByIdAndDelete(issueId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Issue not found");
    }
    return result;
};

// Get issue statistics
const getIssueStatistics = async () => {
    const stats = await Issue.aggregate([
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
        stats[0].byPriority?.forEach((priority: string) => {
            byPriority[priority as keyof typeof byPriority]++;
        });
    }

    return {
        total: stats[0]?.total || 0,
        pending: stats[0]?.pending || 0,
        ongoing: stats[0]?.ongoing || 0,
        answered: stats[0]?.answered || 0,
        closed: stats[0]?.closed || 0,
        byPriority
    };
};

export const IssueServices = {
    raiseIssue,
    getAllIssues,
    getSingleIssue,
    getMyRaisedIssues,
    updateIssueStatus,
    deleteIssue,
    getIssueStatistics,
};