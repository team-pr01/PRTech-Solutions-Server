import { Schema, model } from "mongoose";
import { TProject } from "./project.interface";

// Installment Schema
const InstallmentSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Credit Card", "PayPal", "Other"],
    },
    receiver: { type: String, trim: true },
    note: { type: String, trim: true },
  },
  { _id: true }
);

// Contact Person Schema
const ContactPersonSchema = new Schema(
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
    name: { type: String, required: true, trim: true },
    projectType: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Full Stack Website", "Mobile App-Android", "Mobile App-iOS", "UI/UX Design", "Redesign", "Other"],
    },
    description: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ["Ongoing", "Completed", "On Hold", "Yet to Start"],
      default: "Yet to Start",
    },
    priceCurrency: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    installments: [InstallmentSchema],
    dueAmount: { type: Number, default: 0 },
    phases: [{ type: String, trim: true }],
    onGoingPhase: { type: String, trim: true },
    timelineLink: { type: String, trim: true },
    contactPerson: [ContactPersonSchema],
    notes: { type: String, trim: true },
    projectLinks: [{ type: String, trim: true }],
    clientId: { type: String, required: true, ref: "Client" },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ projectType: 1 });
ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ endDate: 1 });

// Pre-save middleware to calculate due amount
ProjectSchema.pre("save", function(next) {
  if (this.price && this.installments && this.installments.length > 0) {
    const totalPaid = this.installments.reduce((sum, installment) => sum + installment.amount, 0);
    this.dueAmount = this.price - totalPaid;
  } else if (this.price) {
    this.dueAmount = this.price;
  }
  next();
});

const Project = model<TProject>("Project", ProjectSchema);
export default Project;