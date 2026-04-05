import { Schema, model } from "mongoose";
import { TFollowUp, TLead, TSocialMedia } from "./lead.interface";

// Social Media Sub-schema
const SocialMediaSchema = new Schema<TSocialMedia>(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: true }
);

// Follow Up Sub-schema
const FollowUpSchema = new Schema<TFollowUp>(
  {
    key: { type: String, required: true, trim: true },
    followUpDate: { type: Date, required: true },
    response: { type: String, trim: true },
  },
  { timestamps: true }
);

// Main Lead Schema
const LeadSchema = new Schema<TLead>(
  {
    // Basic Information
    businessName: { 
      type: String, 
      required: true, 
      trim: true, 
      index: true 
    },
    businessContactNumber: { 
      type: String, 
      required: true, 
      trim: true 
    },
    country: { 
      type: String, 
      required: true, 
      trim: true, 
      index: true 
    },
    city: {
      type: String, 
      required: true,
      trim: true, 
      index: true 
    },
    address: { 
      type: String, 
      trim: true 
    },
    
    // Owner Information
    ownerName: { 
      type: String,
      trim: true 
    },
    ownerContactNumber: { 
      type: String, 
      trim: true 
    },
    isWhatsapp: { 
      type: Boolean, 
      default: false 
    },
    ownerEmail: { 
      type: String, 
      lowercase: true, 
      trim: true 
    },
    
    // Social Media & Online Presence
    socialMedia: [SocialMediaSchema],
    website: { 
      type: String, 
      trim: true 
    },
    
    // Lead Details
    issueFound: { 
      type: String,
      required: true,
      trim: true 
    },
    priority: { 
      type: Number,
      min: 1, 
      max: 5,
      index: true 
    },
    category: { 
      type: String, 
      required: true, 
      trim: true, 
      index: true 
    },
    
    // Discovery Call
    discoveryCallScheduledDate: { 
      type: Date, 
      index: true 
    },
    discoveryCallScheduledTime: { 
      type: String, 
      trim: true 
    },
    discoveryCallNotes: { 
      type: String, 
      trim: true 
    },
    
    // Follow Ups
    followUps: [FollowUpSchema],
    
    // Status & Tracking
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Discovery Call Scheduled", "Closed", "Not Interested", "For Future"],
      required: true,
      default: "Pending",
      index: true,
    },
    nextAction: { 
      type: String, 
      trim: true 
    },
    
    // Additional Information
    leadSource: { 
      type: String, 
      trim: true 
    },
    notes: { 
      type: String, 
      trim: true 
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
LeadSchema.index({ status: 1, priority: 1 });
LeadSchema.index({ country: 1, city: 1 });
LeadSchema.index({ discoveryCallScheduledDate: 1 });
LeadSchema.index({ "followUps.followUpDate": 1 });
LeadSchema.index({ businessName: "text", ownerName: "text" });

const Lead = model<TLead>("Lead", LeadSchema);
export default Lead;