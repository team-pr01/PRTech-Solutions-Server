import { Schema, model } from "mongoose";
import { TCalendar } from "./calendar.interface";

const CalendarSchema = new Schema<TCalendar>(
    {
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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for better query performance
CalendarSchema.index({ userId: 1, date: 1 });
CalendarSchema.index({ userId: 1, status: 1 });
CalendarSchema.index({ date: -1 });

const Calendar = model<TCalendar>("Calendar", CalendarSchema);
export default Calendar;