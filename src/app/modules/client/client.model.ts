import { Schema, model } from "mongoose";
import { TClient, TSubordinate } from "./client.interface";

// Subordinate Schema
const SubordinateSchema = new Schema<TSubordinate>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phoneNumber: {
      countryCode: { type: String, trim: true },
      phoneNumber: { type: String, trim: true },
    },
    designation: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: true } // Automatically creates _id for each subordinate
);

// Main Client Schema
const ClientSchema = new Schema<TClient>(
  {
    // Personal Details
    clientId: {
      type: String,
      required: false,
      unique: true,
      trim: true
    },
    name: { type: String, required: true, trim: true },

    emails: [
      {
        email: { type: String, required: true, lowercase: true, trim: true },
        type: { type: String, required: true, trim: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    phoneNumbers: [
      {
        type: { type: String, required: true, trim: true },
        countryCode: { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    socialMedia: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },

    // Subordinates / Partners / Team Members
    subordinates: [SubordinateSchema],

    // Communication Preferences
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp", "other"],
      default: "email",
    },
    languages: [{ type: String, trim: true }],
    timezone: { type: String, trim: true, default: "UTC" },

    // Location Details
    country: { type: String, required: true, trim: true },
    address: { type: String, trim: true },

    // Additional Details
    source: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },

    // Business Details
    industry: { type: String, trim: true },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+", "1000+", "unknown"],
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ClientSchema.index({ name: 1 });
ClientSchema.index({ "emails.email": 1 });
ClientSchema.index({ source: 1 });
ClientSchema.index({ createdAt: -1 });
ClientSchema.index({ "subordinates.email": 1 });
ClientSchema.index({ "subordinates.name": 1 });

const Client = model<TClient>("Client", ClientSchema);
export default Client;