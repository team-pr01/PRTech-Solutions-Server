/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TQuery } from "./query.interface";
import Query from "./query.model";
import { infinitePaginate } from "../../utils/infinitePaginate";

// Raise a new query
const raiseQuery = async (payload: TQuery, userId: string) => {

  const payloadData = {
    ...payload,
    raisedBy : userId,
    status: "pending",
  };

  const result = await Query.create(payloadData);
  return result;
};

// Get all queries with filters and pagination
const getAllQueries = async (
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = {};

  // SEARCH (subject, description)
  if (filters.keyword) {
    query.$or = [
      { subject: { $regex: filters.keyword, $options: "i" } },
      { description: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  // STATUS FILTER
  if (filters.status) {
    query.status = filters.status;
  }

  // PRIORITY FILTER
  if (filters.priority) {
    query.priority = filters.priority;
  }

  // QUERY TYPE FILTER
  if (filters.queryType) {
    query.queryType = { $regex: `^${filters.queryType.trim()}$`, $options: "i" };
  }

  // RAISED BY FILTER
  if (filters.raisedBy) {
    query.raisedBy = filters.raisedBy;
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

  return infinitePaginate(
    Query,
    query,
    skip,
    limit,
    ["raisedBy"]
  );
};

// Get single query by ID
const getSingleQuery = async (queryId: string) => {
  const result = await Query.findById(queryId).populate("raisedBy", "name email");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }
  return result;
};

// Get my queries (for logged-in user)
const getMyQueries = async (
  userId: string,
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = { raisedBy: userId };

  // SEARCH (subject, description)
  if (filters.keyword) {
    query.$or = [
      { subject: { $regex: filters.keyword, $options: "i" } },
      { description: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  // STATUS FILTER
  if (filters.status) {
    query.status = filters.status;
  }

  // PRIORITY FILTER
  if (filters.priority) {
    query.priority = filters.priority;
  }

  // QUERY TYPE FILTER
  if (filters.queryType) {
    query.queryType = { $regex: `^${filters.queryType.trim()}$`, $options: "i" };
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

  return infinitePaginate(
    Query,
    query,
    skip,
    limit,
    [""]
  );
};

// Update query status
const updateQueryStatus = async (
  queryId: string,
  status: "pending" | "answered" | "closed"
) => {
  const query = await Query.findById(queryId);
  if (!query) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }

  query.status = status;
  await query.save();
  return query;
};

// Answer a query
const answerQuery = async (
  queryId: string,
  answer: string
) => {
  const query = await Query.findById(queryId);
  if (!query) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }

  query.answer = answer;
  query.status = "answered";
  query.answeredAt = new Date();
  await query.save();
  return query;
};

// Delete query
const deleteQuery = async (queryId: string) => {
  const result = await Query.findByIdAndDelete(queryId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }
  return result;
};

// Get queries by user
const getQueriesByUser = async (
  userId: string,
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = { raisedBy: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  return infinitePaginate(Query, query, skip, limit, ["raisedBy"]);
};

export const QueryServices = {
  raiseQuery,
  getAllQueries,
  getSingleQuery,
  getMyQueries,
  updateQueryStatus,
  answerQuery,
  deleteQuery,
  getQueriesByUser,
};