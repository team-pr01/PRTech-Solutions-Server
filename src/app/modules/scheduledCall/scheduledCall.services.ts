/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TScheduledCall } from "./scheduledCall.interface";
import ScheduledCall from "./scheduledCall.model";
import { infinitePaginate } from "../../utils/infinitePaginate";

// Schedule a call
const scheduleCall = async (payload: TScheduledCall) => {
  const { email, phoneNumber } = payload;

  // Check for duplicate within 24 hours
  const existingCall = await ScheduledCall.findOne({
    email,
    phoneNumber,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (existingCall) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already scheduled a call within the last 24 hours. Our team will reach out to you soon."
    );
  }

  const result = await ScheduledCall.create(payload);
  return result;
};

// Get all scheduled calls with filters and pagination
const getAllScheduledCalls = async (
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = {};

  // SEARCH (name, email, phoneNumber, message)
  if (filters.keyword) {
    query.$or = [
      { name: { $regex: filters.keyword, $options: "i" } },
      { email: { $regex: filters.keyword, $options: "i" } },
      { phoneNumber: { $regex: filters.keyword, $options: "i" } },
      { message: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  // STATUS FILTER
  if (filters.status) {
    query.status = filters.status;
  }

  // DATE RANGE FILTER
  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) {
      query.createdAt.$gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      query.createdAt.$lte = new Date(filters.dateTo);
    }
  }

  // SCHEDULED DATE FILTER
  if (filters.scheduledDate) {
    const date = new Date(filters.scheduledDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
  }

  return infinitePaginate(
    ScheduledCall,
    query,
    skip,
    limit,
    []
  );
};

// Get single scheduled call by ID
const getSingleScheduledCall = async (callId: string) => {
  const result = await ScheduledCall.findById(callId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Scheduled call not found");
  }
  return result;
};

// Update scheduled call
const updateScheduledCall = async (
  callId: string,
  payload: Partial<TScheduledCall>
) => {
  const existingCall = await ScheduledCall.findById(callId);
  if (!existingCall) {
    throw new AppError(httpStatus.NOT_FOUND, "Scheduled call not found");
  }

  const result = await ScheduledCall.findByIdAndUpdate(callId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete scheduled call
const deleteScheduledCall = async (callId: string) => {
  const result = await ScheduledCall.findByIdAndDelete(callId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Scheduled call not found");
  }
  return result;
};

// Get scheduled call statistics
const getScheduledCallStatistics = async () => {
  const stats = await ScheduledCall.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
      },
    },
  ]);

  return {
    total: stats[0]?.total || 0,
    pending: stats[0]?.pending || 0,
    confirmed: stats[0]?.confirmed || 0,
    completed: stats[0]?.completed || 0,
    cancelled: stats[0]?.cancelled || 0,
  };
};

export const ScheduledCallServices = {
  scheduleCall,
  getAllScheduledCalls,
  getSingleScheduledCall,
  updateScheduledCall,
  deleteScheduledCall,
  getScheduledCallStatistics,
};