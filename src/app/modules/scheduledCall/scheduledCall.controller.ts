import httpStatus from "http-status";
import { ScheduledCallServices } from "./scheduledCall.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Schedule a call
const scheduleCall = catchAsync(async (req, res) => {
  const result = await ScheduledCallServices.scheduleCall(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Call scheduled successfully. Our team will contact you soon.",
    data: result,
  });
});

// Get all scheduled calls
const getAllScheduledCalls = catchAsync(async (req, res) => {
  const {
    keyword,
    status,
    dateFrom,
    dateTo,
    scheduledDate,
    skip,
    limit,
  } = req.query;

  const result = await ScheduledCallServices.getAllScheduledCalls(
    {
      keyword: keyword as string,
      status: status as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      scheduledDate: scheduledDate as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scheduled calls retrieved successfully",
    data: result,
  });
});

// Get single scheduled call
const getSingleScheduledCall = catchAsync(async (req, res) => {
  const { callId } = req.params;
  const result = await ScheduledCallServices.getSingleScheduledCall(callId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scheduled call retrieved successfully",
    data: result,
  });
});

// Update scheduled call
const updateScheduledCall = catchAsync(async (req, res) => {
  const { callId } = req.params;
  const result = await ScheduledCallServices.updateScheduledCall(callId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scheduled call updated successfully",
    data: result,
  });
});

// Delete scheduled call
const deleteScheduledCall = catchAsync(async (req, res) => {
  const { callId } = req.params;
  const result = await ScheduledCallServices.deleteScheduledCall(callId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scheduled call deleted successfully",
    data: result,
  });
});

// Get scheduled call statistics
const getScheduledCallStatistics = catchAsync(async (req, res) => {
  const result = await ScheduledCallServices.getScheduledCallStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scheduled call statistics retrieved successfully",
    data: result,
  });
});

export const ScheduledCallController = {
  scheduleCall,
  getAllScheduledCalls,
  getSingleScheduledCall,
  updateScheduledCall,
  deleteScheduledCall,
  getScheduledCallStatistics,
};