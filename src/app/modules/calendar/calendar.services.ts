/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCalendar } from "./calendar.interface";
import Calendar from "./calendar.model";
import { infinitePaginate } from "../../utils/infinitePaginate";

// Add calendar meeting
const addMeeting = async (userId: string, payload: TCalendar) => {
    const { title, date, startTime, endTime, attendees } = payload;

    const meetingData = {
        title,
        description: payload.description,
        date: new Date(date),
        startTime,
        endTime,
        meetingLink: payload.meetingLink,
        attendees: attendees || [],
        status: payload.status || "upcoming",
        userId,
    };

    const result = await Calendar.create(meetingData);
    return result;
};

// Update calendar meeting
const updateMeeting = async (
    meetingId: string,
    userId: string,
    payload: Partial<TCalendar>
) => {
    const meeting = await Calendar.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError(httpStatus.NOT_FOUND, "Meeting not found");
    }

    // If date is being updated, convert to Date object
    if (payload.date) {
        payload.date = new Date(payload.date);
    }

    const result = await Calendar.findByIdAndUpdate(meetingId, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

// Delete calendar meeting
const deleteMeeting = async (meetingId: string, userId: string) => {
    const meeting = await Calendar.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError(httpStatus.NOT_FOUND, "Meeting not found");
    }

    const result = await Calendar.findByIdAndDelete(meetingId);
    return result;
};

// Get my calendar meetings
const getMyCalendar = async (
    userId: string,
    filters: any = {},
    skip = 0,
    limit = 10
) => {
    const query: any = { userId };

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

    // DATE FILTER (specific date)
    if (filters.date) {
        query.date = new Date(filters.date);
    }

    // DATE RANGE FILTER
    if (filters.dateFrom || filters.dateTo) {
        query.date = {};
        if (filters.dateFrom) {
            query.date.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
            query.date.$lte = new Date(filters.dateTo);
        }
    }

    // MONTH AND YEAR FILTER
    if (filters.month !== undefined && filters.year !== undefined) {
        const startDate = new Date(filters.year, filters.month, 1);
        const endDate = new Date(filters.year, filters.month + 1, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }

    return infinitePaginate(Calendar, query, skip, limit, []);
};

// Get single meeting by ID
const getSingleMeeting = async (meetingId: string, userId: string) => {
    const result = await Calendar.findOne({ _id: meetingId, userId });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Meeting not found");
    }
    return result;
};

// Update meeting status
const updateMeetingStatus = async (
    meetingId: string,
    userId: string,
    status: string
) => {
    const meeting = await Calendar.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError(httpStatus.NOT_FOUND, "Meeting not found");
    }

    const result = await Calendar.findByIdAndUpdate(
        meetingId,
        { status },
        { new: true, runValidators: true }
    );
    return result;
};


export const CalendarServices = {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    getMyCalendar,
    getSingleMeeting,
    updateMeetingStatus,
};