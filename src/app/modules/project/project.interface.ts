export type TProject = {
  name: string;
  projectType: "Frontend" | "Backend" | "Full Stack Website" | "Mobile App-Android" | "Mobile App-iOS" | "UI/UX Design" | "Redesign" | "Other";
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: "Ongoing" | "Completed" | "On Hold" | "Yet to Start";
  priceCurrency: string;
  price: number;
  installments?: {
    amount: number;
    date: Date;
    paymentMethod?: "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "Other";
    receiver?: string;
    note?: string;
  }[];
  dueAmount?: number;
  phases: string[];
  onGoingPhase?: string;
  timelineLink?: string;
  contactPerson?: {
    name: string;
    countryCode: string;
    phoneNumber: string;
    isPrimary?: boolean;
  }[];
  notes?: string;
  projectLinks?: string[];

  // Client reference
  clientId: string;

  createdAt?: Date;
  updatedAt?: Date;
};