import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StaffService } from "./staff.service";

const getAllStaffs = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";

  const result = await StaffService.getAllStaffs(page, limit, search);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff fetched successfully",
    data: result,
  });
});

const getSingleStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StaffService.getSingleStaff(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff retrieved successfully",
    data: result,
  });
});

const updateStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await StaffService.updateStaff(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff updated successfully",
    data: result,
  });
});

const deleteStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StaffService.deleteStaff(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff deleted successfully",
    data: result,
  });
});

export const StaffController = {
  getAllStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
