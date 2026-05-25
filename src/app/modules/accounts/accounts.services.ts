/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TAccounts } from "./accounts.interface";
import Accounts from "./accounts.model";
import { infinitePaginate } from "../../utils/infinitePaginate";
import Project from "../project/project.model";

// Add Account Transaction
const addAccount = async (payload: TAccounts) => {
    const { type, expenseType } = payload;

    // Validate expenseType for expense transactions
    if (type === "expense" && !expenseType) {
        throw new AppError(httpStatus.BAD_REQUEST, "expenseType is required for expense transactions");
    }

    const result = await Accounts.create(payload);
    return result;
};

// Get all account transactions with filtering and pagination
const getAllAccounts = async (
    filters: any = {},
    skip = 0,
    limit = 10
) => {
    const query: any = {};

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

    return infinitePaginate(
        Accounts,
        query,
        skip,
        limit,
        []
    );
};

const getAccountStats = async () => {
    type Currency = "BDT" | "INR";

    // Fetch all projects
    const projects = await Project.find({});

    // Fetch all accounts (for earnings and expenses)
    const accounts = await Accounts.find({});

    // Initialize result objects for BDT and INR
    const result: {
        [key in Currency]: {
            earnings: {
                total: number;
                pending: number;
            };
            expenses: {
                total: number;  // This will be the PAID amount
                paid: number;
                pending: number;
            };
            balance: number;
        };
    } & { monthlyData: any[] } = {
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
        monthlyData: [] as any[],
    };

    // Initialize monthly data object for all months
    const monthlyStats: { [key: string]: { earnings: number; expenses: number } } = {};

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
        const currency = project.priceCurrency as Currency;
        if (!result[currency]) continue;

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
            const currency = account.currency as Currency;
            if (!result[currency]) continue;

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
            const currency = account.currency as Currency;
            if (!result[currency]) continue;

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
    for (const currency of ["BDT", "INR"] as const) {
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
};

// Get single account transaction by id
const getSingleAccount = async (accountId: string) => {
    const result = await Accounts.findById(accountId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Account transaction not found");
    }
    return result;
};

// Update account transaction
const updateAccount = async (accountId: string, payload: Partial<TAccounts>) => {
    const existingAccount = await Accounts.findById(accountId);

    if (!existingAccount) {
        throw new AppError(httpStatus.NOT_FOUND, "Account transaction not found");
    }

    // Recalculate pending amount if totalAmount or paidAmount changes
    if (payload.totalAmount !== undefined || payload.paidAmount !== undefined) {
        const totalAmount = payload.totalAmount !== undefined ? payload.totalAmount : existingAccount.totalAmount;
        const paidAmount = payload.paidAmount !== undefined ? payload.paidAmount : existingAccount.paidAmount;
        payload.pendingAmount = totalAmount - (paidAmount || 0);
    }

    const result = await Accounts.findByIdAndUpdate(accountId, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

// Delete account transaction (Hard delete)
const deleteAccount = async (accountId: string) => {
    const result = await Accounts.findByIdAndDelete(accountId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Account transaction not found");
    }
    return result;
};

// Get account summary (totals)
const getAccountSummary = async (filters: any = {}) => {
    const query: any = {};

    if (filters.type) query.type = filters.type;
    if (filters.currency) query.currency = filters.currency;
    if (filters.dateFrom || filters.dateTo) {
        query.date = {};
        if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
    }

    const summary = await Accounts.aggregate([
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

    const result: any = {};

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
        } else if (type === "expense") {
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
};

export const AccountServices = {
    addAccount,
    getAllAccounts,
    getAccountStats,
    getSingleAccount,
    updateAccount,
    deleteAccount,
    getAccountSummary,
};