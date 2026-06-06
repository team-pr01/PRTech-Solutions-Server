import httpStatus from "http-status";
import { CalendarServices } from "./calendar.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Add meeting
const addMeeting = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await CalendarServices.addMeeting(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Meeting added successfully",
    data: result,
  });
});

// Update meeting
const updateMeeting = catchAsync(async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.user._id;
  const result = await CalendarServices.updateMeeting(meetingId, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting updated successfully",
    data: result,
  });
});

// Delete meeting
const deleteMeeting = catchAsync(async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.user._id;
  const result = await CalendarServices.deleteMeeting(meetingId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting deleted successfully",
    data: result,
  });
});

// Get my calendar meetings
const getMyCalendar = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const {
    keyword,
    status,
    date,
    dateFrom,
    dateTo,
    month,
    year,
    skip,
    limit,
  } = req.query;

  const result = await CalendarServices.getMyCalendar(
    userId,
    {
      keyword: keyword as string,
      status: status as string,
      date: date as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      month: month ? parseInt(month as string) : undefined,
      year: year ? parseInt(year as string) : undefined,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Calendar retrieved successfully",
    data: result,
  });
});

// Get single meeting
const getSingleMeeting = catchAsync(async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.user._id;
  const result = await CalendarServices.getSingleMeeting(meetingId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting retrieved successfully",
    data: result,
  });
});

// Update meeting status
const updateMeetingStatus = catchAsync(async (req, res) => {
  const { meetingId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;
  const result = await CalendarServices.updateMeetingStatus(meetingId, userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting status updated successfully",
    data: result,
  });
});

export const CalendarController = {
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getMyCalendar,
  getSingleMeeting,
  updateMeetingStatus,
};