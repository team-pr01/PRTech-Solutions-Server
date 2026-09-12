import { ObjectId } from "mongoose";

export type TStaff = {
  _id: string;
  userId: ObjectId;
  pagesAssigned: string[];
  jobRole: string;
  whatsappNumber?: string;
  bank: {
    bankName: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankPhoneNumber?: string;
  },
  panCardFrontImage?: string;
  panCardBackImage?: string;
};
