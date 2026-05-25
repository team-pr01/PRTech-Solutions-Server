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
    name: { type: String, trim: true },
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
    startDate: { type: Date },
    endDate: { type: Date },
}, { _id: true });
// Expenditure Schema
const ExpenditureSchema = new mongoose_1.Schema({
    description: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    pendingAmount: { type: Number, required: true, min: 0 },
}, { _id: true });
// Contact Person Schema
const ContactPersonSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
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
    deadline: { type: String, trim: true },
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
    contactPerson: [ContactPersonSchema],
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
    // Calculate total pending amount from all phases
    if (this.phases && this.phases.length > 0) {
        const totalPhasePending = this.phases.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0);
        this.pendingAmount = totalPhasePending;
    }
    // If pendingAmount is not set from phases, use the provided value
    if (!this.pendingAmount && this.price) {
        this.pendingAmount = this.price;
    }
    next();
});
const Project = (0, mongoose_1.model)("Project", ProjectSchema);
exports.default = Project;
