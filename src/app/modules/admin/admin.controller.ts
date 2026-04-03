// controllers/adminStats.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminStatsService } from "./admin.service";

const getPlatformOverview = catchAsync(async (req, res) => {
  const result = await AdminStatsService.getPlatformOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform overview fetched successfully",
    data: result,
  });
});

export const AdminStatsController = {
  getPlatformOverview,
};
