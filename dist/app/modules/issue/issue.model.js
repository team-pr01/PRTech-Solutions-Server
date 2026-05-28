"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IssueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "ongoing", "resolved", "closed"],
        default: "pending",
        index: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
        index: true,
    },
    images: [
        {
            type: String,
            trim: true,
        },
    ],
    resolvedAt: {
        type: Date,
    },
    raisedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Compound indexes for better query performance
IssueSchema.index({ status: 1, priority: 1 });
IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ raisedBy: 1, status: 1 });
const Issue = (0, mongoose_1.model)("Issue", IssueSchema);
exports.default = Issue;
