import httpStatus from "http-status";
import { IssueServices } from "./issue.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Raise a new issue
const raiseIssue = catchAsync(async (req, res) => {
    const userId = req.user._id;
  const files = (req.files as Express.Multer.File[]) || [];
  const result = await IssueServices.raiseIssue(
    userId,
    req.body,
    files
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Issue raised successfully",
    data: result,
  });
});

// Get all issues
const getAllIssues = catchAsync(async (req, res) => {
  const {
    keyword,
    status,
    priority,
    raisedBy,
    dateFrom,
    dateTo,
    skip,
    limit,
  } = req.query;

  const result = await IssueServices.getAllIssues(
    {
      keyword: keyword as string,
      status: status as string,
      priority: priority as string,
      raisedBy: raisedBy as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Issues retrieved successfully",
    data: result,
  });
});

// Get single issue
const getSingleIssue = catchAsync(async (req, res) => {
  const { issueId } = req.params;
  const result = await IssueServices.getSingleIssue(issueId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Issue retrieved successfully",
    data: result,
  });
});

// Get my raised issues
const getMyRaisedIssues = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const {
    keyword,
    status,
    priority,
    dateFrom,
    dateTo,
    skip,
    limit,
  } = req.query;

  const result = await IssueServices.getMyRaisedIssues(
    userId,
    {
      keyword: keyword as string,
      status: status as string,
      priority: priority as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My issues retrieved successfully",
    data: result,
  });
});

// Update issue status
const updateIssueStatus = catchAsync(async (req, res) => {
  const { issueId } = req.params;
  const { status } = req.body;
  const result = await IssueServices.updateIssueStatus(issueId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Issue status updated successfully",
    data: result,
  });
});

// Delete issue
const deleteIssue = catchAsync(async (req, res) => {
  const { issueId } = req.params;
  const result = await IssueServices.deleteIssue(issueId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Issue deleted successfully",
    data: result,
  });
});

// Get issue statistics
const getIssueStatistics = catchAsync(async (req, res) => {
  const result = await IssueServices.getIssueStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Issue statistics retrieved successfully",
    data: result,
  });
});

export const IssueController = {
  raiseIssue,
  getAllIssues,
  getSingleIssue,
  getMyRaisedIssues,
  updateIssueStatus,
  deleteIssue,
  getIssueStatistics,
};