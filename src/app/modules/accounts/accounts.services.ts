/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TAccounts } from "./accounts.interface";
import Accounts from "./accounts.model";
import { infinitePaginate } from "../../utils/infinitePaginate";

// Add Account Transaction
const addAccount = async (payload: TAccounts) => {
    const { type, expenseType, totalAmount, paidAmount } = payload;

    // Validate expenseType for expense transactions
    if (type === "expense" && !expenseType) {
        throw new AppError(httpStatus.BAD_REQUEST, "expenseType is required for expense transactions");
    }

    // Calculate pending amount
    const pendingAmount = totalAmount - (paidAmount || 0);

    const payloadData = {
        ...payload,
        pendingAmount,
        paidAmount: paidAmount || 0,
    };

    const result = await Accounts.create(payloadData);
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
    getSingleAccount,
    updateAccount,
    deleteAccount,
    getAccountSummary,
};