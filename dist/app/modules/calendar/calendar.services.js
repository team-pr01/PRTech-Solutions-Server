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
exports.CalendarServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const calendar_model_1 = __importDefault(require("./calendar.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Add calendar meeting
const addMeeting = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield calendar_model_1.default.create(meetingData);
    return result;
});
// Update calendar meeting
const updateMeeting = (meetingId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const meeting = yield calendar_model_1.default.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meeting not found");
    }
    // If date is being updated, convert to Date object
    if (payload.date) {
        payload.date = new Date(payload.date);
    }
    const result = yield calendar_model_1.default.findByIdAndUpdate(meetingId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete calendar meeting
const deleteMeeting = (meetingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const meeting = yield calendar_model_1.default.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meeting not found");
    }
    const result = yield calendar_model_1.default.findByIdAndDelete(meetingId);
    return result;
});
// Get my calendar meetings
const getMyCalendar = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}, skip = 0, limit = 10) {
    const query = { userId };
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
    return (0, infinitePaginate_1.infinitePaginate)(calendar_model_1.default, query, skip, limit, []);
});
// Get single meeting by ID
const getSingleMeeting = (meetingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield calendar_model_1.default.findOne({ _id: meetingId, userId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meeting not found");
    }
    return result;
});
// Update meeting status
const updateMeetingStatus = (meetingId, userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const meeting = yield calendar_model_1.default.findOne({ _id: meetingId, userId });
    if (!meeting) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meeting not found");
    }
    const result = yield calendar_model_1.default.findByIdAndUpdate(meetingId, { status }, { new: true, runValidators: true });
    return result;
});
exports.CalendarServices = {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    getMyCalendar,
    getSingleMeeting,
    updateMeetingStatus,
};
