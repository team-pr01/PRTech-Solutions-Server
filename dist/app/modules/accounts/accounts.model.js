"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Main Accounts Schema
const AccountsSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["earning", "expense"],
        required: true,
        index: true,
    },
    expenseType: {
        type: String,
        enum: ["salary", "ui/ux", "tools", "graphics", "deployment", "other"],
        required: function () {
            return this.type === "expense";
        },
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        default: "USD",
        index: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    pendingAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    paidBy: {
        type: String,
        trim: true,
        index: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    note: {
        type: String,
        trim: true,
        default: null,
    }
}, {
    timestamps: true,
});
// Pre-save middleware to calculate pending amount
AccountsSchema.pre("save", function (next) {
    if (this.totalAmount && this.paidAmount !== undefined) {
        this.pendingAmount = this.totalAmount - this.paidAmount;
    }
    next();
});
// Compound indexes for better query performance
AccountsSchema.index({ type: 1, date: -1 });
AccountsSchema.index({ expenseType: 1, type: 1 });
AccountsSchema.index({ currency: 1, paymentMethod: 1 });
const Accounts = (0, mongoose_1.model)("Accounts", AccountsSchema);
exports.default = Accounts;
