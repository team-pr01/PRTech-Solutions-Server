import { Types } from "mongoose";

export type TCalendar = {
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  attendees: string[];
  status: "upcoming" | "completed" | "cancelled";
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};