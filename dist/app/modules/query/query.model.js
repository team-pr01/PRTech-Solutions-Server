"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QuerySchema = new mongoose_1.Schema({
    subject: {
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
        enum: ["pending", "answered", "closed"],
        default: "pending",
        index: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
        index: true,
    },
    queryType: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    answer: {
        type: String,
        trim: true,
    },
    answeredAt: {
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
QuerySchema.index({ status: 1, priority: 1 });
QuerySchema.index({ createdAt: -1 });
QuerySchema.index({ raisedBy: 1, status: 1 });
const Query = (0, mongoose_1.model)("Query", QuerySchema);
exports.default = Query;
