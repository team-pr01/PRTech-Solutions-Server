"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
// Social Media Sub-schema
const SocialMediaSchema = new mongoose_1.Schema({
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
}, { _id: true });
// Follow Up Sub-schema
const FollowUpSchema = new mongoose_1.Schema({
    key: { type: String, required: true, trim: true },
    followUpDate: { type: Date, required: true },
    response: { type: String, trim: true },
}, { timestamps: true });
// Main Lead Schema
const LeadSchema = new mongoose_1.Schema({
    quickLink: {
        type: String,
        trim: true
    },
    // Basic Information
    businessName: {
        type: String,
        trim: true,
        index: true
    },
    businessContactNumber: {
        type: String,
        trim: true,
        // Removed sparse: true and default: undefined
    },
    country: {
        type: String,
        trim: true,
        index: true
    },
    city: {
        type: String,
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
        trim: true,
        // Removed sparse: true
    },
    // Lead Details
    issueFound: {
        type: String,
        trim: true
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        index: true
    },
    niche: {
        type: String,
        trim: true,
        index: true
    },
    subNiche: {
        type: String,
        trim: true,
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
        default: "Pending",
        index: true,
    },
    nextAction: {
        type: String,
        trim: true
    },
    addedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
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
}, {
    timestamps: true,
});
// ==========================================
// MIDDLEWARES TO PREVENT EMPTY STRING ERRORS
// ==========================================
// 1. For standard .save()
LeadSchema.pre("save", function (next) {
    if (this.website === "" || this.website === null) {
        this.website = undefined;
    }
    if (this.businessContactNumber === "" || this.businessContactNumber === null) {
        this.set("businessContactNumber", undefined);
    }
    next();
});
// 2. For .findOneAndUpdate() (Used in your error stack trace)
LeadSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    // Handle website
    if (update.website === "" || update.website === null) {
        delete update.website;
        update.$unset = Object.assign(Object.assign({}, update.$unset), { website: 1 });
    }
    // Handle businessContactNumber
    if (update.businessContactNumber === "" || update.businessContactNumber === null) {
        delete update.businessContactNumber;
        update.$unset = Object.assign(Object.assign({}, update.$unset), { businessContactNumber: 1 });
    }
    next();
});
// ==========================================
// COMPOUND & UNIQUE INDEXES
// ==========================================
LeadSchema.index({ status: 1, priority: 1 });
LeadSchema.index({ country: 1, city: 1 });
LeadSchema.index({ discoveryCallScheduledDate: 1 });
LeadSchema.index({ "followUps.followUpDate": 1 });
LeadSchema.index({ businessName: "text", ownerName: "text" });
// Replaced sparse: true with partialFilterExpression
// This ensures the unique constraint ONLY applies if the field is a valid non-empty string
LeadSchema.index({ website: 1 }, {
    unique: true,
    partialFilterExpression: { website: { $type: "string", $ne: "" } }
});
LeadSchema.index({ businessContactNumber: 1 }, {
    unique: true,
    partialFilterExpression: { businessContactNumber: { $type: "string", $ne: "" } }
});
const Lead = (0, mongoose_1.model)("Lead", LeadSchema);
exports.default = Lead;
