import { ObjectId } from "mongoose";

export type TStaff = {
  _id: string;
  userId: ObjectId;
  pagesAssigned: string[];
  jobRole : string
};
