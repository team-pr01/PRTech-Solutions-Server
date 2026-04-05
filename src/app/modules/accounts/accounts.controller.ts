import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AccountServices } from "./accounts.services";

// Add Account Transaction
const addAccount = catchAsync(async (req, res) => {
  const result = await AccountServices.addAccount(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account transaction added successfully",
    data: result,
  });
});

// Get All Account Transactions
const getAllAccounts = catchAsync(async (req, res) => {
  const {
    keyword,
    type,
    expenseType,
    currency,
    paidBy,
    paymentMethod,
    date,
    skip,
    limit,
  } = req.query;

  const result = await AccountServices.getAllAccounts(
    {
      keyword: keyword as string,
      type: type as string,
      expenseType: expenseType as string,
      currency: currency as string,
      paidBy: paidBy as string,
      paymentMethod: paymentMethod as string,
      date: date as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account transactions retrieved successfully",
    data: result,
  });
});

// Get Single Account Transaction
const getSingleAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const result = await AccountServices.getSingleAccount(accountId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account transaction retrieved successfully",
    data: result,
  });
});

// Update Account Transaction
const updateAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const result = await AccountServices.updateAccount(accountId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account transaction updated successfully",
    data: result,
  });
});

// Delete Account Transaction
const deleteAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const result = await AccountServices.deleteAccount(accountId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account transaction deleted successfully",
    data: result,
  });
});

// Get Account Summary
const getAccountSummary = catchAsync(async (req, res) => {
  const { type, currency, dateFrom, dateTo } = req.query;
  
  const result = await AccountServices.getAccountSummary({
    type: type as string,
    currency: currency as string,
    dateFrom: dateFrom as string,
    dateTo: dateTo as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account summary retrieved successfully",
    data: result,
  });
});

export const AccountControllers = {
  addAccount,
  getAllAccounts,
  getSingleAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
};