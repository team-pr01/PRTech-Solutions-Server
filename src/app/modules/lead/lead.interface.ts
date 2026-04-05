
export type TSocialMedia = {
  platform: string;
  url: string;
};

export type TFollowUp = {
  key: string; // "1st follow up", "2nd follow up", "3rd follow up", etc.
  followUpDate: Date;
  response?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TLead = {
  // Basic Information
  businessName: string;
  businessContactNumber: string;
  country: string;
  city?: string;
  address?: string;

  // Owner Information
  ownerName: string;
  ownerContactNumber: string;
  isWhatsapp: boolean;
  ownerEmail?: string;

  // Social Media & Online Presence
  socialMedia?: TSocialMedia[];
  website?: string;

  // Lead Details
  issueFound?: string;
  priority: number;
  category: string;

  // Discovery Call
  discoveryCallScheduledDate?: Date;
  discoveryCallScheduledTime?: string;
  discoveryCallNotes?: string;

  // Follow Ups
  followUps: TFollowUp[];

  // Status & Tracking
  status: "Pending" | "Ongoing" | "Discovery Call Scheduled" | "Closed" | "Not Interested" | "For Future";
  nextAction?: string;

  // Additional Information
  leadSource?: string;
  notes?: string;

  // System fields
  createdAt?: Date;
  updatedAt?: Date;
};