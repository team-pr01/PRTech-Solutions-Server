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
exports.CalendarController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const calendar_services_1 = require("./calendar.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Add meeting
const addMeeting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield calendar_services_1.CalendarServices.addMeeting(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Meeting added successfully",
        data: result,
    });
}));
// Update meeting
const updateMeeting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    const userId = req.user._id;
    const result = yield calendar_services_1.CalendarServices.updateMeeting(meetingId, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meeting updated successfully",
        data: result,
    });
}));
// Delete meeting
const deleteMeeting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    const userId = req.user._id;
    const result = yield calendar_services_1.CalendarServices.deleteMeeting(meetingId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meeting deleted successfully",
        data: result,
    });
}));
// Get my calendar meetings
const getMyCalendar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { keyword, status, date, dateFrom, dateTo, month, year, skip, limit, } = req.query;
    const result = yield calendar_services_1.CalendarServices.getMyCalendar(userId, {
        keyword: keyword,
        status: status,
        date: date,
        dateFrom: dateFrom,
        dateTo: dateTo,
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar retrieved successfully",
        data: result,
    });
}));
// Get single meeting
const getSingleMeeting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    const userId = req.user._id;
    const result = yield calendar_services_1.CalendarServices.getSingleMeeting(meetingId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meeting retrieved successfully",
        data: result,
    });
}));
// Update meeting status
const updateMeetingStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const result = yield calendar_services_1.CalendarServices.updateMeetingStatus(meetingId, userId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meeting status updated successfully",
        data: result,
    });
}));
exports.CalendarController = {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    getMyCalendar,
    getSingleMeeting,
    updateMeetingStatus,
};
