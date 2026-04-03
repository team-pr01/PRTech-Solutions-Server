export type TSubordinate = {
  name: string;
  email?: string;
  phoneNumber?: {
    countryCode: string;
    phoneNumber: string;
  };
  designation?: string;
  notes?: string;
};

export type TClient = {
  // Personal Details
  clientId: string;
  name: string;
  emails: {
    email: string;
    type: string;
    isPrimary?: boolean;
  }[];
  phoneNumbers: {
    type: string;
    countryCode: string;
    phoneNumber: string;
    isPrimary?: boolean;
  }[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  // Subordinates / Partners / Team Members
  subordinates?: TSubordinate[];

  // Communication Preferences
  preferredContactMethod?: "email" | "phone" | "whatsapp" | "other";
  languages?: string[];
  timezone?: string;

  // Location Details
  country: string;
  address?: string;

  // Additional Details
  source: string;
  notes?: string;

  // Business Details
  industry?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "500+" | "1000+" | "unknown";

  createdAt?: Date;
  updatedAt?: Date;
};