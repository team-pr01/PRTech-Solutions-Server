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
exports.ScheduledCallServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const scheduledCall_model_1 = __importDefault(require("./scheduledCall.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Schedule a call
const scheduleCall = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = payload;
    // Check for duplicate within 24 hours
    const existingCall = yield scheduledCall_model_1.default.findOne({
        email,
        phoneNumber,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (existingCall) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You have already scheduled a call within the last 24 hours. Our team will reach out to you soon.");
    }
    const result = yield scheduledCall_model_1.default.create(payload);
    return result;
});
// Get all scheduled calls with filters and pagination
const getAllScheduledCalls = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (name, email, phoneNumber, message)
    if (filters.keyword) {
        query.$or = [
            { name: { $regex: filters.keyword, $options: "i" } },
            { email: { $regex: filters.keyword, $options: "i" } },
            { phoneNumber: { $regex: filters.keyword, $options: "i" } },
            { message: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = filters.status;
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
    // SCHEDULED DATE FILTER
    if (filters.scheduledDate) {
        const date = new Date(filters.scheduledDate);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    }
    return (0, infinitePaginate_1.infinitePaginate)(scheduledCall_model_1.default, query, skip, limit, []);
});
// Get single scheduled call by ID
const getSingleScheduledCall = (callId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield scheduledCall_model_1.default.findById(callId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Scheduled call not found");
    }
    return result;
});
// Update scheduled call
const updateScheduledCall = (callId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCall = yield scheduledCall_model_1.default.findById(callId);
    if (!existingCall) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Scheduled call not found");
    }
    const result = yield scheduledCall_model_1.default.findByIdAndUpdate(callId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete scheduled call
const deleteScheduledCall = (callId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield scheduledCall_model_1.default.findByIdAndDelete(callId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Scheduled call not found");
    }
    return result;
});
// Get scheduled call statistics
const getScheduledCallStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const stats = yield scheduledCall_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            },
        },
    ]);
    return {
        total: ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        pending: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.pending) || 0,
        confirmed: ((_c = stats[0]) === null || _c === void 0 ? void 0 : _c.confirmed) || 0,
        completed: ((_d = stats[0]) === null || _d === void 0 ? void 0 : _d.completed) || 0,
        cancelled: ((_e = stats[0]) === null || _e === void 0 ? void 0 : _e.cancelled) || 0,
    };
});
exports.ScheduledCallServices = {
    scheduleCall,
    getAllScheduledCalls,
    getSingleScheduledCall,
    updateScheduledCall,
    deleteScheduledCall,
    getScheduledCallStatistics,
};
