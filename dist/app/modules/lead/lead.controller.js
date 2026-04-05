"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const lead_services_1 = require("./lead.services");
// Add Lead
const addLead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lead_services_1.LeadServices.addLead(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Lead added successfully",
        data: result,
    });
}));
// Get All Leads
const getAllLeads = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, country, city, status, category, priority, leadSource, discoveryCallScheduledDate, followUpDate, assignedTo, convertedToClient, skip, limit, } = req.query;
    const result = yield lead_services_1.LeadServices.getAllLeads({
        keyword: keyword,
        country: country,
        city: city,
        status: status,
        category: category,
        priority: priority,
        leadSource: leadSource,
        discoveryCallScheduledDate: discoveryCallScheduledDate,
        followUpDate: followUpDate,
        assignedTo: assignedTo,
        convertedToClient: convertedToClient,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Leads retrieved successfully",
        data: result,
    });
}));
// Get Single Lead
const getSingleLead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const result = yield lead_services_1.LeadServices.getSingleLead(leadId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lead retrieved successfully",
        data: result,
    });
}));
// Update Lead
const updateLead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const result = yield lead_services_1.LeadServices.updateLead(leadId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lead updated successfully",
        data: result,
    });
}));
// Add Follow Up
const addFollowUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const result = yield lead_services_1.LeadServices.addFollowUp(leadId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Follow up added successfully",
        data: result,
    });
}));
// Delete Follow Up
const deleteFollowUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId, followUpId } = req.params;
    const result = yield lead_services_1.LeadServices.deleteFollowUp(leadId, followUpId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${result.deletedFollowUpKey} deleted successfully`,
        data: result.lead,
    });
}));
// Delete Lead (Soft Delete)
const deleteLead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const result = yield lead_services_1.LeadServices.deleteLead(leadId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lead deleted successfully",
        data: result,
    });
}));
// Get Lead Statistics
const getLeadStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lead_services_1.LeadServices.getLeadStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lead statistics retrieved successfully",
        data: result,
    });
}));
// Schedule Discovery Call
const scheduleDiscoveryCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    const { discoveryCallScheduledDate, discoveryCallScheduledTime, discoveryCallNotes } = req.body;
    const result = yield lead_services_1.LeadServices.scheduleDiscoveryCall(leadId, {
        discoveryCallScheduledDate,
        discoveryCallScheduledTime,
        discoveryCallNotes,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Discovery call scheduled successfully",
        data: result,
    });
}));
exports.LeadControllers = {
    addLead,
    getAllLeads,
    getSingleLead,
    updateLead,
    addFollowUp,
    deleteFollowUp,
    deleteLead,
    getLeadStatistics,
    scheduleDiscoveryCall,
};
