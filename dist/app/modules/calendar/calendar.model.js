"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CalendarSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    meetingLink: {
        type: String,
        trim: true,
    },
    attendees: [
        { type: String, trim: true },
    ],
    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled"],
        default: "upcoming",
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Compound indexes for better query performance
CalendarSchema.index({ userId: 1, date: 1 });
CalendarSchema.index({ userId: 1, status: 1 });
CalendarSchema.index({ date: -1 });
const Calendar = (0, mongoose_1.model)("Calendar", CalendarSchema);
exports.default = Calendar;
