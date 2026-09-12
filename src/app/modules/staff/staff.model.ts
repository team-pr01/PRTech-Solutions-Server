import { Schema, model, Types } from "mongoose";
import { TStaff } from "./staff.interface";

const StaffSchema = new Schema<TStaff>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    pagesAssigned: {
      type: [String],
      default : [],
    },
    jobRole : { type: String, required: true },
    whatsappNumber : { type: String },
    bank : {
      bankName: { type: String, required: true },
      bankAccountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankPhoneNumber: { type: String },
    },
    panCardFrontImage : { type: String },
    panCardBackImage : { type: String },
  },
  { timestamps: true }
);

export const Staff = model<TStaff>("Staff", StaffSchema);