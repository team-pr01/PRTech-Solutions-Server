import { Types } from "mongoose";

export type TInstallment = {
  amount: number;
  date: Date;
  paymentMethod?: "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "bKash" | "Nagad" | "PhonePe" | "Google Pay" | "Payoneer" | "Other";
  receiver?: string;
  note?: string;
};

export type TPhase = {
  _id?: string;
  toObject(): unknown;
  name: string;
  phaseStatus: "Pending" | "Yet to Start" | "Ongoing" | "On Hold" | "Completed";
  totalAmount: number;
  pendingAmount: number;
  paymentStatus: "Pending" | "Paid";
  installments: TInstallment[];
  startDate: Date;
  endDate?: Date;
};

export type TExpenditure = {
  description: string;
  totalAmount: number;
  pendingAmount: number;
};

export type TContactPerson = {
  name: string;
  countryCode: string;
  phoneNumber: string;
  isPrimary?: boolean;
};

export type TProject = {
  name: string;
  projectType: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  status: "Ongoing" | "Completed" | "On Hold" | "Yet to Start";
  priceCurrency: string;
  price: number;
  pendingAmount: number;
  phases: TPhase[];
  onGoingPhase?: string;
  timelineLink?: string;
  expenditures: TExpenditure[];
  contactPerson: TContactPerson[];
  notes?: string;
  projectLinks?: string[];
  
  // Client reference
  clientId: Types.ObjectId | string;

  createdAt?: Date;
  updatedAt?: Date;
};