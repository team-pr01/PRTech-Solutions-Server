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
exports.AccountServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const accounts_model_1 = __importDefault(require("./accounts.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Add Account Transaction
const addAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, expenseType, totalAmount, paidAmount } = payload;
    // Validate expenseType for expense transactions
    if (type === "expense" && !expenseType) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "expenseType is required for expense transactions");
    }
    // Calculate pending amount
    const pendingAmount = totalAmount - (paidAmount || 0);
    const payloadData = Object.assign(Object.assign({}, payload), { pendingAmount, paidAmount: paidAmount || 0 });
    const result = yield accounts_model_1.default.create(payloadData);
    return result;
});
// Get all account transactions with filtering and pagination
const getAllAccounts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // TYPE FILTER
    if (filters.type) {
        query.type = filters.type;
    }
    // EXPENSE TYPE FILTER
    if (filters.expenseType) {
        query.expenseType = filters.expenseType;
    }
    // PAID BY FILTER (partial match)
    if (filters.paidBy) {
        query.paidBy = { $regex: filters.paidBy, $options: "i" };
    }
    if (filters.date) {
        const startDate = new Date(filters.date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(filters.date);
        endDate.setHours(23, 59, 59, 999);
        query.date = {
            $gte: startDate,
            $lte: endDate,
        };
    }
    // KEYWORD SEARCH (searches across multiple fields)
    if (filters.keyword) {
        query.$or = [
            { description: { $regex: filters.keyword, $options: "i" } },
            { currency: { $regex: filters.keyword, $options: "i" } },
            { paymentMethod: { $regex: filters.keyword, $options: "i" } }
        ];
    }
    return (0, infinitePaginate_1.infinitePaginate)(accounts_model_1.default, query, skip, limit, []);
});
// Get single account transaction by id
const getSingleAccount = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accounts_model_1.default.findById(accountId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account transaction not found");
    }
    return result;
});
// Update account transaction
const updateAccount = (accountId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAccount = yield accounts_model_1.default.findById(accountId);
    if (!existingAccount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account transaction not found");
    }
    // Recalculate pending amount if totalAmount or paidAmount changes
    if (payload.totalAmount !== undefined || payload.paidAmount !== undefined) {
        const totalAmount = payload.totalAmount !== undefined ? payload.totalAmount : existingAccount.totalAmount;
        const paidAmount = payload.paidAmount !== undefined ? payload.paidAmount : existingAccount.paidAmount;
        payload.pendingAmount = totalAmount - (paidAmount || 0);
    }
    const result = yield accounts_model_1.default.findByIdAndUpdate(accountId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete account transaction (Hard delete)
const deleteAccount = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accounts_model_1.default.findByIdAndDelete(accountId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account transaction not found");
    }
    return result;
});
// Get account summary (totals)
const getAccountSummary = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    const query = {};
    if (filters.type)
        query.type = filters.type;
    if (filters.currency)
        query.currency = filters.currency;
    if (filters.dateFrom || filters.dateTo) {
        query.date = {};
        if (filters.dateFrom)
            query.date.$gte = new Date(filters.dateFrom);
        if (filters.dateTo)
            query.date.$lte = new Date(filters.dateTo);
    }
    const summary = yield accounts_model_1.default.aggregate([
        { $match: query },
        {
            $group: {
                _id: {
                    type: "$type",
                    currency: "$currency",
                },
                totalAmount: { $sum: "$totalAmount" },
                totalPaid: { $sum: "$paidAmount" },
                totalPending: { $sum: "$pendingAmount" },
                count: { $sum: 1 },
            },
        },
    ]);
    // Group by currency
    const currencies = [...new Set(summary.map(s => s._id.currency))];
    const result = {};
    // Initialize for each currency
    currencies.forEach(currency => {
        result[currency] = {
            earnings: { total: 0, paid: 0, pending: 0, count: 0 },
            expenses: { total: 0, paid: 0, pending: 0, count: 0 },
            balance: 0,
            netPaid: 0,
            netPending: 0,
        };
    });
    // Populate data
    summary.forEach(item => {
        const { type, currency } = item._id;
        const currencyData = result[currency];
        if (type === "earning") {
            currencyData.earnings = {
                total: item.totalAmount,
                paid: item.totalPaid,
                pending: item.totalPending,
                count: item.count,
            };
        }
        else if (type === "expense") {
            currencyData.expenses = {
                total: item.totalAmount,
                paid: item.totalPaid,
                pending: item.totalPending,
                count: item.count,
            };
        }
        // Calculate balance for each currency
        currencyData.balance = currencyData.earnings.total - currencyData.expenses.total;
        currencyData.netPaid = currencyData.earnings.paid - currencyData.expenses.paid;
        currencyData.netPending = currencyData.earnings.pending - currencyData.expenses.pending;
    });
    return result;
});
exports.AccountServices = {
    addAccount,
    getAllAccounts,
    getSingleAccount,
    updateAccount,
    deleteAccount,
    getAccountSummary,
};
