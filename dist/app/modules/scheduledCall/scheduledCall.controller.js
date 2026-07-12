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
exports.ScheduledCallController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const scheduledCall_services_1 = require("./scheduledCall.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Schedule a call
const scheduleCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield scheduledCall_services_1.ScheduledCallServices.scheduleCall(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Call scheduled successfully. Our team will contact you soon.",
        data: result,
    });
}));
// Get all scheduled calls
const getAllScheduledCalls = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, dateFrom, dateTo, scheduledDate, skip, limit, } = req.query;
    const result = yield scheduledCall_services_1.ScheduledCallServices.getAllScheduledCalls({
        keyword: keyword,
        status: status,
        dateFrom: dateFrom,
        dateTo: dateTo,
        scheduledDate: scheduledDate,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Scheduled calls retrieved successfully",
        data: result,
    });
}));
// Get single scheduled call
const getSingleScheduledCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    const result = yield scheduledCall_services_1.ScheduledCallServices.getSingleScheduledCall(callId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Scheduled call retrieved successfully",
        data: result,
    });
}));
// Update scheduled call
const updateScheduledCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    const result = yield scheduledCall_services_1.ScheduledCallServices.updateScheduledCall(callId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Scheduled call updated successfully",
        data: result,
    });
}));
// Delete scheduled call
const deleteScheduledCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    const result = yield scheduledCall_services_1.ScheduledCallServices.deleteScheduledCall(callId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Scheduled call deleted successfully",
        data: result,
    });
}));
// Get scheduled call statistics
const getScheduledCallStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield scheduledCall_services_1.ScheduledCallServices.getScheduledCallStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Scheduled call statistics retrieved successfully",
        data: result,
    });
}));
exports.ScheduledCallController = {
    scheduleCall,
    getAllScheduledCalls,
    getSingleScheduledCall,
    updateScheduledCall,
    deleteScheduledCall,
    getScheduledCallStatistics,
};
