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
exports.LeadServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const lead_model_1 = __importDefault(require("./lead.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Generate next follow up key
const generateFollowUpKey = (followUpCount) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = followUpCount % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${followUpCount}${suffix} follow up`;
};
// Add Lead
const addLead = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, businessContactNumber, } = payload;
    // Check if lead with same business name and contact number exists
    const existingLead = yield lead_model_1.default.findOne({
        businessName,
        businessContactNumber,
    });
    if (existingLead) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Lead with this business name and contact number already exists");
    }
    const payloadData = Object.assign({}, payload);
    const result = yield lead_model_1.default.create(payloadData);
    return result;
});
// Get all leads with filtering and pagination
const getAllLeads = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (business name, owner name, email, contact number)
    if (filters.keyword) {
        query.$or = [
            { businessName: { $regex: filters.keyword, $options: "i" } },
            { ownerName: { $regex: filters.keyword, $options: "i" } },
            { ownerEmail: { $regex: filters.keyword, $options: "i" } },
            { businessContactNumber: { $regex: filters.keyword, $options: "i" } },
            { ownerContactNumber: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // COUNTRY FILTER
    if (filters.country) {
        query.country = { $regex: `^${filters.country.trim()}$`, $options: "i" };
    }
    // CITY FILTER
    if (filters.city) {
        query.city = { $regex: `^${filters.city.trim()}$`, $options: "i" };
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = { $regex: `^${filters.status.trim()}$`, $options: "i" };
    }
    // CATEGORY FILTER
    if (filters.category) {
        query.category = { $regex: `^${filters.category.trim()}$`, $options: "i" };
    }
    // PRIORITY FILTER (Fix for number priority)
    if (filters.priority) {
        query.priority = parseInt(filters.priority); // Convert to number, not regex
    }
    // DISCOVERY CALL SCHEDULED DATE - SINGLE DATE (FIXED)
    if (filters.discoveryCallScheduledDate) {
        const date = new Date(filters.discoveryCallScheduledDate);
        // Match the entire day (from start to end)
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.discoveryCallScheduledDate = {
            $gte: startOfDay,
            $lte: endOfDay,
        };
    }
    // DISCOVERY CALL DATE RANGE (if you want to keep both options)
    if (filters.discoveryCallFrom || filters.discoveryCallTo) {
        query.discoveryCallScheduledDate = {};
        if (filters.discoveryCallFrom) {
            query.discoveryCallScheduledDate.$gte = new Date(filters.discoveryCallFrom);
        }
        if (filters.discoveryCallTo) {
            query.discoveryCallScheduledDate.$lte = new Date(filters.discoveryCallTo);
        }
    }
    // FOLLOW UP DATE FILTER (SINGLE DATE)
    if (filters.followUpDate) {
        const date = new Date(filters.followUpDate);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query["followUps.followUpDate"] = {
            $gte: startOfDay,
            $lte: endOfDay,
        };
    }
    // FOLLOW UP DATE RANGE (optional)
    if (filters.followUpFrom || filters.followUpTo) {
        query["followUps.followUpDate"] = {};
        if (filters.followUpFrom) {
            query["followUps.followUpDate"].$gte = new Date(filters.followUpFrom);
        }
        if (filters.followUpTo) {
            query["followUps.followUpDate"].$lte = new Date(filters.followUpTo);
        }
    }
    return (0, infinitePaginate_1.infinitePaginate)(lead_model_1.default, query, skip, limit, []);
});
// Get single lead by id
const getSingleLead = (leadId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lead_model_1.default.findById(leadId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    return result;
});
// Update lead
const updateLead = (leadId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLead = yield lead_model_1.default.findById(leadId);
    if (!existingLead) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    const result = yield lead_model_1.default.findByIdAndUpdate(leadId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Add follow up to lead
const addFollowUp = (leadId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const lead = yield lead_model_1.default.findById(leadId);
    if (!lead) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    const followUpCount = (((_a = lead.followUps) === null || _a === void 0 ? void 0 : _a.length) || 0) + 1;
    const key = generateFollowUpKey(followUpCount);
    const newFollowUp = {
        key,
        followUpDate: payload.followUpDate,
        response: payload.response,
    };
    lead.followUps = lead.followUps || [];
    lead.followUps.push(newFollowUp);
    // Update status if needed
    if (lead.status === "Pending") {
        lead.status = "Ongoing";
    }
    yield lead.save();
    return lead;
});
// Delete Follow Up
const deleteFollowUp = (leadId, followUpId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const lead = yield lead_model_1.default.findById(leadId);
    if (!lead) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    const followUpExists = (_a = lead.followUps) === null || _a === void 0 ? void 0 : _a.some((followUp) => { var _a; return ((_a = followUp._id) === null || _a === void 0 ? void 0 : _a.toString()) === followUpId; });
    if (!followUpExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Follow up not found");
    }
    // Find the follow up to get its key for response message
    const followUpToDelete = lead.followUps.find((followUp) => { var _a; return ((_a = followUp._id) === null || _a === void 0 ? void 0 : _a.toString()) === followUpId; });
    lead.followUps = (_b = lead.followUps) === null || _b === void 0 ? void 0 : _b.filter((followUp) => { var _a; return ((_a = followUp._id) === null || _a === void 0 ? void 0 : _a.toString()) !== followUpId; });
    yield lead.save();
    return {
        lead,
        deletedFollowUpKey: followUpToDelete === null || followUpToDelete === void 0 ? void 0 : followUpToDelete.key,
    };
});
// Delete lead (Soft delete)
const deleteLead = (leadId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLead = yield lead_model_1.default.findById(leadId);
    if (!existingLead) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    const result = yield lead_model_1.default.findByIdAndDelete(leadId);
    return result;
});
// Get lead statistics
const getLeadStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield lead_model_1.default.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                byStatus: {
                    $push: "$status"
                },
                byPriority: {
                    $push: "$priority"
                },
                byCategory: {
                    $push: "$category"
                },
                convertedCount: {
                    $sum: { $cond: ["$convertedToClient", 1, 0] }
                }
            }
        },
        {
            $project: {
                totalLeads: 1,
                convertedCount: 1,
                conversionRate: {
                    $multiply: [
                        { $divide: ["$convertedCount", "$totalLeads"] },
                        100
                    ]
                },
                statusBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: { $setUnion: ["$byStatus"] },
                            as: "status",
                            in: {
                                k: "$$status",
                                v: { $size: { $filter: { input: "$byStatus", as: "s", cond: { $eq: ["$$s", "$$status"] } } } }
                            }
                        }
                    }
                },
                priorityBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: { $setUnion: ["$byPriority"] },
                            as: "priority",
                            in: {
                                k: "$$priority",
                                v: { $size: { $filter: { input: "$byPriority", as: "p", cond: { $eq: ["$$p", "$$priority"] } } } }
                            }
                        }
                    }
                }
            }
        }
    ]);
    return stats[0] || {
        totalLeads: 0,
        convertedCount: 0,
        conversionRate: 0,
        statusBreakdown: {},
        priorityBreakdown: {}
    };
});
// Schedule Discovery Call
const scheduleDiscoveryCall = (leadId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const lead = yield lead_model_1.default.findById(leadId);
    if (!lead) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lead not found");
    }
    // Validate that the scheduled date is not in the past
    const scheduledDate = new Date(payload.discoveryCallScheduledDate);
    const now = new Date();
    // Reset time part for date comparison only (if comparing just dates)
    scheduledDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    if (scheduledDate < now) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot schedule discovery call for a past date");
    }
    const updateData = {
        discoveryCallScheduledDate: payload.discoveryCallScheduledDate,
        discoveryCallScheduledTime: payload.discoveryCallScheduledTime,
        discoveryCallNotes: payload.discoveryCallNotes,
        status: "Discovery Call Scheduled",
    };
    const result = yield lead_model_1.default.findByIdAndUpdate(leadId, updateData, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.LeadServices = {
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
