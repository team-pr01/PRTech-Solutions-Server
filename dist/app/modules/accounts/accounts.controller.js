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
exports.AccountControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const accounts_services_1 = require("./accounts.services");
// Add Account Transaction
const addAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accounts_services_1.AccountServices.addAccount(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Account transaction added successfully",
        data: result,
    });
}));
// Get All Account Transactions
const getAllAccounts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, type, expenseType, currency, paidBy, paymentMethod, date, skip, limit, } = req.query;
    const result = yield accounts_services_1.AccountServices.getAllAccounts({
        keyword: keyword,
        type: type,
        expenseType: expenseType,
        currency: currency,
        paidBy: paidBy,
        paymentMethod: paymentMethod,
        date: date,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account transactions retrieved successfully",
        data: result,
    });
}));
// Get Single Account Transaction
const getSingleAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const result = yield accounts_services_1.AccountServices.getSingleAccount(accountId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account transaction retrieved successfully",
        data: result,
    });
}));
// Update Account Transaction
const updateAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const result = yield accounts_services_1.AccountServices.updateAccount(accountId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account transaction updated successfully",
        data: result,
    });
}));
// Delete Account Transaction
const deleteAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const result = yield accounts_services_1.AccountServices.deleteAccount(accountId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account transaction deleted successfully",
        data: result,
    });
}));
// Get Account Summary
const getAccountSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, currency, dateFrom, dateTo } = req.query;
    const result = yield accounts_services_1.AccountServices.getAccountSummary({
        type: type,
        currency: currency,
        dateFrom: dateFrom,
        dateTo: dateTo,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account summary retrieved successfully",
        data: result,
    });
}));
exports.AccountControllers = {
    addAccount,
    getAllAccounts,
    getSingleAccount,
    updateAccount,
    deleteAccount,
    getAccountSummary,
};
