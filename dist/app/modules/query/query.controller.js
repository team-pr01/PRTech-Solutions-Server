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
exports.QueryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const query_services_1 = require("./query.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Raise a new query
const raiseQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield query_services_1.QueryServices.raiseQuery(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Query raised successfully",
        data: result,
    });
}));
// Get all queries
const getAllQueries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, priority, queryType, raisedBy, dateFrom, dateTo, skip, limit, } = req.query;
    const result = yield query_services_1.QueryServices.getAllQueries({
        keyword: keyword,
        status: status,
        priority: priority,
        queryType: queryType,
        raisedBy: raisedBy,
        dateFrom: dateFrom,
        dateTo: dateTo,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Queries retrieved successfully",
        data: result,
    });
}));
// Get single query
const getSingleQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const result = yield query_services_1.QueryServices.getSingleQuery(queryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query retrieved successfully",
        data: result,
    });
}));
// Get my queries (for logged-in user)
const getMyQueries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { keyword, status, priority, queryType, dateFrom, dateTo, skip, limit, } = req.query;
    const result = yield query_services_1.QueryServices.getMyQueries(userId, {
        keyword: keyword,
        status: status,
        priority: priority,
        queryType: queryType,
        dateFrom: dateFrom,
        dateTo: dateTo,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My queries retrieved successfully",
        data: result,
    });
}));
// Update query status
const updateQueryStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const { status } = req.body;
    const result = yield query_services_1.QueryServices.updateQueryStatus(queryId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query status updated successfully",
        data: result,
    });
}));
// Answer a query
const answerQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const { answer } = req.body;
    const result = yield query_services_1.QueryServices.answerQuery(queryId, answer);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query answered successfully",
        data: result,
    });
}));
// Delete query
const deleteQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const result = yield query_services_1.QueryServices.deleteQuery(queryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query deleted successfully",
        data: result,
    });
}));
// Get queries by user
const getQueriesByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { status, priority, skip, limit } = req.query;
    const result = yield query_services_1.QueryServices.getQueriesByUser(userId, {
        status: status,
        priority: priority,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User queries retrieved successfully",
        data: result,
    });
}));
exports.QueryController = {
    raiseQuery,
    getAllQueries,
    getSingleQuery,
    getMyQueries,
    updateQueryStatus,
    answerQuery,
    deleteQuery,
    getQueriesByUser,
};
