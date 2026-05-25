/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { TProject, TInstallment, TPhase, TExpenditure, TContactPerson } from "./project.interface";

// Installment Schema
const InstallmentSchema = new Schema<TInstallment>(
  {
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Credit Card", "PayPal", "bKash", "Nagad", "PhonePe", "Google Pay", "Payoneer", "Other"],
      default: "Bank Transfer",
    },
    receiver: { type: String, trim: true },
    note: { type: String, trim: true },
  },
  { _id: true }
);

// Phase Schema
const PhaseSchema = new Schema<TPhase>(
  {
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
  },
  { _id: true }
);

// Expenditure Schema
const ExpenditureSchema = new Schema<TExpenditure>(
  {
    description: { type: String, trim: true },
    totalAmount: { type: Number, min: 0 },
    pendingAmount: { type: Number, min: 0 },
    date: { type: Date },
    paymentMethod: { type: String },
  },
  { _id: true }
);

// Contact Person Schema
const ContactPersonSchema = new Schema<TContactPerson>(
  {
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

// Main Project Schema
const ProjectSchema = new Schema<TProject>(
  {
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
    clientId: { type: Schema.Types.ObjectId, required: true, ref: "Client", index: true },
  },
  {
    timestamps: true,
  }
);

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

const Project = model<TProject>("Project", ProjectSchema);
export default Project;