"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
// Installment Schema
const InstallmentSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Credit Card", "PayPal", "bKash", "Nagad", "PhonePe", "Google Pay", "Payoneer", "Other"],
        default: "Bank Transfer",
    },
    receiver: { type: String, trim: true },
    note: { type: String, trim: true },
}, { _id: true });
// Phase Schema
const PhaseSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    phaseStatus: {
        type: String,
        enum: ["Pending", "Yet to Start", "Ongoing", "On Hold", "Completed"],
        default: "Pending",
    },
    totalAmount: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, default: 0, min: 0 },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
    },
    installments: [InstallmentSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
}, { _id: true });
// Expenditure Phase Item Schema (nested inside expenditure)
const ExpenditurePhaseItemSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    paidAmount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    paymentMethod: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
}, { _id: true });
// Expenditure Schema (updated according to new type)
const ExpenditureSchema = new mongoose_1.Schema({
    description: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    pendingAmount: { type: Number, required: true, min: 0 },
    phases: [ExpenditurePhaseItemSchema],
}, { _id: true });
// Main Project Schema
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, index: true },
    projectType: {
        type: String,
        required: true,
        index: true,
    },
    description: { type: String, trim: true },
    startDate: { type: Date, index: true },
    endDate: { type: Date, index: true },
    deadline: { type: Date },
    status: {
        type: String,
        required: true,
        enum: ["Ongoing", "Completed", "On Hold", "Yet to Start"],
        default: "Yet to Start",
        index: true,
    },
    priceCurrency: {
        type: String,
        required: true,
        default: "USD",
    },
    price: { type: Number, required: true, default: 0, min: 0 },
    pendingAmount: { type: Number, default: 0, min: 0 },
    phases: [PhaseSchema],
    onGoingPhase: { type: String, trim: true },
    timelineLink: { type: String, trim: true },
    expenditures: [ExpenditureSchema],
    notes: { type: String, trim: true },
    projectLinks: [{ type: String, trim: true }],
    clientId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Client", index: true },
}, {
    timestamps: true,
});
// Compound indexes for better query performance
ProjectSchema.index({ status: 1, projectType: 1 });
ProjectSchema.index({ clientId: 1, createdAt: -1 });
ProjectSchema.index({ startDate: 1, endDate: 1 });
// Pre-save middleware to calculate project pending amount from phases
ProjectSchema.pre("save", function (next) {
    // Calculate pending amount from phases
    if (this.phases && this.phases.length > 0) {
        this.pendingAmount = this.phases.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0);
    }
    else {
        this.pendingAmount = this.price || 0;
    }
    next();
});
// Pre-save middleware to calculate expenditure totals (optional)
// Pre-save middleware to calculate expenditure totals
ProjectSchema.pre("save", function (next) {
    if (this.expenditures && this.expenditures.length > 0) {
        for (const expenditure of this.expenditures) {
            if (expenditure.phases && expenditure.phases.length > 0) {
                // Calculate total paid from all phases
                const totalPaid = expenditure.phases.reduce((sum, phase) => sum + (phase.paidAmount || 0), 0);
                expenditure.pendingAmount = Math.max(0, expenditure.totalAmount - totalPaid);
            }
            else {
                // If no phases, keep original values
                expenditure.totalAmount = expenditure.totalAmount || 0;
                expenditure.pendingAmount = expenditure.pendingAmount || 0;
            }
        }
    }
    next();
});
const Project = (0, mongoose_1.model)("Project", ProjectSchema);
exports.default = Project;
