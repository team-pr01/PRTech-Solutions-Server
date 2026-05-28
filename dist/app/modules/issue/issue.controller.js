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
exports.IssueController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const issue_services_1 = require("./issue.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Raise a new issue
const raiseIssue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const files = req.files || [];
    const result = yield issue_services_1.IssueServices.raiseIssue(userId, req.body, files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Issue raised successfully",
        data: result,
    });
}));
// Get all issues
const getAllIssues = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, priority, raisedBy, dateFrom, dateTo, skip, limit, } = req.query;
    const result = yield issue_services_1.IssueServices.getAllIssues({
        keyword: keyword,
        status: status,
        priority: priority,
        raisedBy: raisedBy,
        dateFrom: dateFrom,
        dateTo: dateTo,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Issues retrieved successfully",
        data: result,
    });
}));
// Get single issue
const getSingleIssue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params;
    const result = yield issue_services_1.IssueServices.getSingleIssue(issueId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Issue retrieved successfully",
        data: result,
    });
}));
// Get my raised issues
const getMyRaisedIssues = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { keyword, status, priority, dateFrom, dateTo, skip, limit, } = req.query;
    const result = yield issue_services_1.IssueServices.getMyRaisedIssues(userId, {
        keyword: keyword,
        status: status,
        priority: priority,
        dateFrom: dateFrom,
        dateTo: dateTo,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My issues retrieved successfully",
        data: result,
    });
}));
// Update issue status
const updateIssueStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params;
    const { status } = req.body;
    const result = yield issue_services_1.IssueServices.updateIssueStatus(issueId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Issue status updated successfully",
        data: result,
    });
}));
// Delete issue
const deleteIssue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params;
    const result = yield issue_services_1.IssueServices.deleteIssue(issueId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Issue deleted successfully",
        data: result,
    });
}));
// Get issue statistics
const getIssueStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield issue_services_1.IssueServices.getIssueStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Issue statistics retrieved successfully",
        data: result,
    });
}));
exports.IssueController = {
    raiseIssue,
    getAllIssues,
    getSingleIssue,
    getMyRaisedIssues,
    updateIssueStatus,
    deleteIssue,
    getIssueStatistics,
};
