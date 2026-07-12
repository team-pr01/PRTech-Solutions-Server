"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ScheduledCallSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
        index: true,
    },
    scheduledDate: {
        type: Date,
        index: true,
    },
    scheduledTime: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Compound indexes for better query performance
ScheduledCallSchema.index({ email: 1, status: 1 });
ScheduledCallSchema.index({ scheduledDate: 1, status: 1 });
ScheduledCallSchema.index({ createdAt: -1 });
const ScheduledCall = (0, mongoose_1.model)("ScheduledCall", ScheduledCallSchema);
exports.default = ScheduledCall;
