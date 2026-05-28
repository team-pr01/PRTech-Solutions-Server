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
exports.QueryServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const query_model_1 = __importDefault(require("./query.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Raise a new query
const raiseQuery = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = Object.assign(Object.assign({}, payload), { raisedBy: userId, status: "pending" });
    const result = yield query_model_1.default.create(payloadData);
    return result;
});
// Get all queries with filters and pagination
const getAllQueries = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (subject, description)
    if (filters.keyword) {
        query.$or = [
            { subject: { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = filters.status;
    }
    // PRIORITY FILTER
    if (filters.priority) {
        query.priority = filters.priority;
    }
    // QUERY TYPE FILTER
    if (filters.queryType) {
        query.queryType = { $regex: `^${filters.queryType.trim()}$`, $options: "i" };
    }
    // RAISED BY FILTER
    if (filters.raisedBy) {
        query.raisedBy = filters.raisedBy;
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
    return (0, infinitePaginate_1.infinitePaginate)(query_model_1.default, query, skip, limit, ["raisedBy"]);
});
// Get single query by ID
const getSingleQuery = (queryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield query_model_1.default.findById(queryId).populate("raisedBy", "name email");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    return result;
});
// Get my queries (for logged-in user)
const getMyQueries = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}, skip = 0, limit = 10) {
    const query = { raisedBy: userId };
    // SEARCH (subject, description)
    if (filters.keyword) {
        query.$or = [
            { subject: { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = filters.status;
    }
    // PRIORITY FILTER
    if (filters.priority) {
        query.priority = filters.priority;
    }
    // QUERY TYPE FILTER
    if (filters.queryType) {
        query.queryType = { $regex: `^${filters.queryType.trim()}$`, $options: "i" };
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
    return (0, infinitePaginate_1.infinitePaginate)(query_model_1.default, query, skip, limit, [""]);
});
// Update query status
const updateQueryStatus = (queryId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield query_model_1.default.findById(queryId);
    if (!query) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    query.status = status;
    yield query.save();
    return query;
});
// Answer a query
const answerQuery = (queryId, answer) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield query_model_1.default.findById(queryId);
    if (!query) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    query.answer = answer;
    query.status = "answered";
    query.answeredAt = new Date();
    yield query.save();
    return query;
});
// Delete query
const deleteQuery = (queryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield query_model_1.default.findByIdAndDelete(queryId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    return result;
});
// Get queries by user
const getQueriesByUser = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}, skip = 0, limit = 10) {
    const query = { raisedBy: userId };
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.priority) {
        query.priority = filters.priority;
    }
    return (0, infinitePaginate_1.infinitePaginate)(query_model_1.default, query, skip, limit, ["raisedBy"]);
});
exports.QueryServices = {
    raiseQuery,
    getAllQueries,
    getSingleQuery,
    getMyQueries,
    updateQueryStatus,
    answerQuery,
    deleteQuery,
    getQueriesByUser,
};
