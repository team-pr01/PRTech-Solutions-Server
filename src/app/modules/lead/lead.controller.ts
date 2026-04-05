import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { LeadServices } from "./lead.services";

// Add Lead
const addLead = catchAsync(async (req, res) => {
  const result = await LeadServices.addLead(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Lead added successfully",
    data: result,
  });
});

// Get All Leads
const getAllLeads = catchAsync(async (req, res) => {
  const {
    keyword,
    country,
    city,
    status,
    category,
    priority,
    leadSource,
    discoveryCallScheduledDate,
    followUpDate,
    assignedTo,
    convertedToClient,
    skip,
    limit,
  } = req.query;

  const result = await LeadServices.getAllLeads(
    {
      keyword: keyword as string,
      country: country as string,
      city: city as string,
      status: status as string,
      category: category as string,
      priority: priority as string,
      leadSource: leadSource as string,
      discoveryCallScheduledDate: discoveryCallScheduledDate as string,
      followUpDate: followUpDate as string,
      assignedTo: assignedTo as string,
      convertedToClient: convertedToClient as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leads retrieved successfully",
    data: result,
  });
});

// Get Single Lead
const getSingleLead = catchAsync(async (req, res) => {
  const { leadId } = req.params;
  const result = await LeadServices.getSingleLead(leadId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lead retrieved successfully",
    data: result,
  });
});

// Update Lead
const updateLead = catchAsync(async (req, res) => {
  const { leadId } = req.params;
  const result = await LeadServices.updateLead(leadId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lead updated successfully",
    data: result,
  });
});

// Add Follow Up
const addFollowUp = catchAsync(async (req, res) => {
  const { leadId } = req.params;
  const result = await LeadServices.addFollowUp(leadId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Follow up added successfully",
    data: result,
  });
});

// Delete Lead (Soft Delete)
const deleteLead = catchAsync(async (req, res) => {
  const { leadId } = req.params;
  const result = await LeadServices.deleteLead(leadId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lead deleted successfully",
    data: result,
  });
});

// Get Lead Statistics
const getLeadStatistics = catchAsync(async (req, res) => {
  const result = await LeadServices.getLeadStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lead statistics retrieved successfully",
    data: result,
  });
});

export const LeadControllers = {
  addLead,
  getAllLeads,
  getSingleLead,
  updateLead,
  addFollowUp,
  deleteLead,
  getLeadStatistics,
};