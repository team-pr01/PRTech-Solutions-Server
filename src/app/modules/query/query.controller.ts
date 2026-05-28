import httpStatus from "http-status";
import { QueryServices } from "./query.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Raise a new query
const raiseQuery = catchAsync(async (req, res) => {
    const userId = req.user._id
  const result = await QueryServices.raiseQuery(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Query raised successfully",
    data: result,
  });
});

// Get all queries
const getAllQueries = catchAsync(async (req, res) => {
  const {
    keyword,
    status,
    priority,
    queryType,
    raisedBy,
    dateFrom,
    dateTo,
    skip,
    limit,
  } = req.query;

  const result = await QueryServices.getAllQueries(
    {
      keyword: keyword as string,
      status: status as string,
      priority: priority as string,
      queryType: queryType as string,
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
    message: "Queries retrieved successfully",
    data: result,
  });
});

// Get single query
const getSingleQuery = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const result = await QueryServices.getSingleQuery(queryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query retrieved successfully",
    data: result,
  });
});

// Get my queries (for logged-in user)
const getMyQueries = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const {
    keyword,
    status,
    priority,
    queryType,
    dateFrom,
    dateTo,
    skip,
    limit,
  } = req.query;

  const result = await QueryServices.getMyQueries(
    userId,
    {
      keyword: keyword as string,
      status: status as string,
      priority: priority as string,
      queryType: queryType as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My queries retrieved successfully",
    data: result,
  });
});

// Update query status
const updateQueryStatus = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const { status } = req.body;
  const result = await QueryServices.updateQueryStatus(queryId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query status updated successfully",
    data: result,
  });
});

// Answer a query
const answerQuery = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const { answer } = req.body;
  const result = await QueryServices.answerQuery(queryId, answer);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query answered successfully",
    data: result,
  });
});

// Delete query
const deleteQuery = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const result = await QueryServices.deleteQuery(queryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query deleted successfully",
    data: result,
  });
});

// Get queries by user
const getQueriesByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status, priority, skip, limit } = req.query;

  const result = await QueryServices.getQueriesByUser(
    userId,
    {
      status: status as string,
      priority: priority as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User queries retrieved successfully",
    data: result,
  });
});

export const QueryController = {
  raiseQuery,
  getAllQueries,
  getSingleQuery,
  getMyQueries,
  updateQueryStatus,
  answerQuery,
  deleteQuery,
  getQueriesByUser,
};