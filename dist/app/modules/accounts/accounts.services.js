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
const project_model_1 = __importDefault(require("../project/project.model"));
// Add Account Transaction
const addAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, expenseType } = payload;
    // Validate expenseType for expense transactions
    if (type === "expense" && !expenseType) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "expenseType is required for expense transactions");
    }
    const result = yield accounts_model_1.default.create(payload);
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
const getAccountStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all projects
    const projects = yield project_model_1.default.find({});
    // Fetch all accounts (for earnings and expenses)
    const accounts = yield accounts_model_1.default.find({});
    // Initialize result objects for BDT and INR
    const result = {
        BDT: {
            earnings: {
                total: 0,
                pending: 0,
            },
            expenses: {
                total: 0,
                paid: 0,
                pending: 0,
            },
            balance: 0,
        },
        INR: {
            earnings: {
                total: 0,
                pending: 0,
            },
            expenses: {
                total: 0,
                paid: 0,
                pending: 0,
            },
            balance: 0,
        },
        monthlyData: [],
    };
    // Initialize monthly data object for all months
    const monthlyStats = {};
    // Initialize for last 12 months
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    months.forEach(month => {
        monthlyStats[month] = { earnings: 0, expenses: 0 };
    });
    // ========== 1. PROCESS EARNINGS FROM PROJECTS ==========
    for (const project of projects) {
        const currency = project.priceCurrency;
        if (!result[currency])
            continue;
        if (project.phases && project.phases.length > 0) {
            for (const phase of project.phases) {
                // Calculate received amount (totalAmount - pendingAmount)
                const receivedAmount = (phase.totalAmount || 0) - (phase.pendingAmount || 0);
                // Add received amount to earnings total
                result[currency].earnings.total += receivedAmount;
                result[currency].earnings.pending += phase.pendingAmount || 0;
                // Process monthly data from installments
                for (const installment of phase.installments || []) {
                    if (installment.date) {
                        const date = new Date(installment.date);
                        const monthName = months[date.getMonth()];
                        if (monthName && monthlyStats[monthName]) {
                            monthlyStats[monthName].earnings += installment.amount || 0;
                        }
                    }
                }
            }
        }
    }
    // ========== 2. PROCESS EARNINGS FROM ACCOUNTS (type "earning") ==========
    for (const account of accounts) {
        if (account.type === "earning") {
            const currency = account.currency;
            if (!result[currency])
                continue;
            // Add to earnings from accounts
            result[currency].earnings.total += account.totalAmount || 0;
            // Process monthly data from account date
            if (account.date) {
                const date = new Date(account.date);
                const monthName = months[date.getMonth()];
                if (monthName && monthlyStats[monthName]) {
                    monthlyStats[monthName].earnings += account.totalAmount || 0;
                }
            }
        }
    }
    // ========== 3. PROCESS EXPENSES FROM ACCOUNTS (type "expense") ==========
    for (const account of accounts) {
        if (account.type === "expense") {
            const currency = account.currency;
            if (!result[currency])
                continue;
            // IMPORTANT: For expenses total, use PAID AMOUNT, not total amount
            const paidAmount = account.paidAmount || 0;
            // Add to expenses - total is the paid amount
            result[currency].expenses.total += paidAmount;
            result[currency].expenses.paid += paidAmount;
            result[currency].expenses.pending += account.pendingAmount || 0;
            // Process monthly data from account date - use paid amount
            if (account.date) {
                const date = new Date(account.date);
                const monthName = months[date.getMonth()];
                if (monthName && monthlyStats[monthName]) {
                    monthlyStats[monthName].expenses += paidAmount;
                }
            }
        }
    }
    // Calculate balances for each currency
    for (const currency of ["BDT", "INR"]) {
        result[currency].balance = result[currency].earnings.total - result[currency].expenses.total;
    }
    // Convert monthly stats to array format
    const monthlyData = months.map(month => ({
        month,
        earnings: monthlyStats[month].earnings,
        expenses: monthlyStats[month].expenses,
    }));
    result.monthlyData = monthlyData;
    return result;
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
    getAccountStats,
    getSingleAccount,
    updateAccount,
    deleteAccount,
    getAccountSummary,
};
