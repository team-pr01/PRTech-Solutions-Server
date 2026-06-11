import { ObjectId } from "mongoose";

export type TIssue = {
  project : ObjectId;
  title: string;
  description: string;
  status: "pending" | "ongoing" | "resolved" | "closed" | "needToDiscuss" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  images?: string[];
  resolvedAt?: Date;
  raisedBy: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};