import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ClientServices } from "./client.services";

// Add Client
const addClient = catchAsync(async (req, res) => {
  const result = await ClientServices.addClient(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Client added successfully",
    data: result,
  });
});

// Get All Clients
const getAllClients = catchAsync(async (req, res) => {
  const { keyword, status, source, industry, page, limit } = req.query;

  const result = await ClientServices.getAllClients({
    keyword: keyword as string,
    status: status as string,
    source: source as string,
    industry: industry as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Clients retrieved successfully",
    data: result,
  });
});

// Get Single Client
const getSingleClient = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const result = await ClientServices.getSingleClient(clientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client retrieved successfully",
    data: result,
  });
});

// Update Client
const updateClient = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const result = await ClientServices.updateClient(clientId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client updated successfully",
    data: result,
  });
});

// Delete Client (Soft Delete)
const deleteClient = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const result = await ClientServices.deleteClient(clientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client deleted successfully",
    data: result,
  });
});

// Add Subordinate to Client
const addSubordinate = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const result = await ClientServices.addSubordinate(clientId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subordinate added successfully",
    data: result,
  });
});

// Update Subordinate
const updateSubordinate = catchAsync(async (req, res) => {
  const { clientId, subordinateId } = req.params;
  const result = await ClientServices.updateSubordinate(clientId, subordinateId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subordinate updated successfully",
    data: result,
  });
});

// Delete Subordinate
const deleteSubordinate = catchAsync(async (req, res) => {
  const { clientId, subordinateId } = req.params;
  const result = await ClientServices.deleteSubordinate(clientId, subordinateId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subordinate deleted successfully",
    data: result,
  });
});

export const ClientControllers = {
  addClient,
  getAllClients,
  getSingleClient,
  updateClient,
  deleteClient,
  addSubordinate,
  updateSubordinate,
  deleteSubordinate,
};