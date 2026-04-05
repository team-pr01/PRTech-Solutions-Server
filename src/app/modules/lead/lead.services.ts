/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLead, TFollowUp } from "./lead.interface";
import Lead from "./lead.model";
import { infinitePaginate } from "../../utils/infinitePaginate";

// Generate next follow up key
const generateFollowUpKey = (followUpCount: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = followUpCount % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${followUpCount}${suffix} follow up`;
};

// Add Lead
const addLead = async (payload: TLead) => {
  const {
    businessName,
    businessContactNumber,
  } = payload;

  // Check if lead with same business name and contact number exists
  const existingLead = await Lead.findOne({
    businessName,
    businessContactNumber,
  });

  if (existingLead) {
    throw new AppError(httpStatus.CONFLICT, "Lead with this business name and contact number already exists");
  }

  const payloadData = {
    ...payload
  };

  const result = await Lead.create(payloadData);
  return result;
};

// Get all leads with filtering and pagination
const getAllLeads = async (
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = {};

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

  // PRIORITY FILTER
  if (filters.priority) {
    query.priority = { $regex: `^${filters.priority.trim()}$`, $options: "i" };
  }

  // DISCOVERY CALL SCHEDULED DATE RANGE
  if (filters.discoveryCallFrom || filters.discoveryCallTo) {
    query.discoveryCallScheduledDate = {};
    if (filters.discoveryCallFrom) {
      query.discoveryCallScheduledDate.$gte = new Date(filters.discoveryCallFrom);
    }
    if (filters.discoveryCallTo) {
      query.discoveryCallScheduledDate.$lte = new Date(filters.discoveryCallTo);
    }
  }

  // FOLLOW UP DATE RANGE
  if (filters.followUpDate) {
    query["followUps.followUpDate"] = {};
    if (filters.followUpFrom) {
      query["followUps.followUpDate"].$gte = new Date(filters.followUpFrom);
    }
    if (filters.followUpTo) {
      query["followUps.followUpDate"].$lte = new Date(filters.followUpTo);
    }
  }

  return infinitePaginate(
    Lead,
    query,
    skip,
    limit,
    []
  );
};

// Get single lead by id
const getSingleLead = async (leadId: string) => {
  const result = await Lead.findById(leadId);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Lead not found");
  }
  return result;
};

// Update lead
const updateLead = async (leadId: string, payload: Partial<TLead>) => {
  const existingLead = await Lead.findById(leadId);

  if (!existingLead) {
    throw new AppError(httpStatus.NOT_FOUND, "Lead not found");
  }

  const result = await Lead.findByIdAndUpdate(leadId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Add follow up to lead
const addFollowUp = async (leadId: string, payload: { followUpDate: Date; response?: string }) => {
  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new AppError(httpStatus.NOT_FOUND, "Lead not found");
  }

  const followUpCount = (lead.followUps?.length || 0) + 1;
  const key = generateFollowUpKey(followUpCount);

  const newFollowUp: TFollowUp = {
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

  await lead.save();
  return lead;
};

// Delete lead (Soft delete)
const deleteLead = async (leadId: string) => {
  const existingLead = await Lead.findById(leadId);

  if (!existingLead) {
    throw new AppError(httpStatus.NOT_FOUND, "Lead not found");
  }

  const result = await Lead.findByIdAndDelete(leadId);

  return result;
};

// Get lead statistics
const getLeadStatistics = async () => {
  const stats = await Lead.aggregate([
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
};

export const LeadServices = {
  addLead,
  getAllLeads,
  getSingleLead,
  updateLead,
  addFollowUp,
  deleteLead,
  getLeadStatistics,
};