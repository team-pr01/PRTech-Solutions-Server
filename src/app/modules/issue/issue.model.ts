import { Schema, model } from "mongoose";
import { TIssue } from "./issue.interface";

const IssueSchema = new Schema<TIssue>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "resolved", "closed"],
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    resolvedAt: {
      type: Date,
    },
    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
IssueSchema.index({ status: 1, priority: 1 });
IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ raisedBy: 1, status: 1 });

const Issue = model<TIssue>("Issue", IssueSchema);
export default Issue;