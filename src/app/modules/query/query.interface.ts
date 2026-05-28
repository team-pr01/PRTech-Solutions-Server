import { ObjectId } from "mongoose";

export type TQuery = {
  _id: string;
  subject: string;
  description: string;
  status: "pending" | "ongoing" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  queryType: string;
  answeredAt?: Date;
  answer?: string;
  raisedBy : ObjectId
};