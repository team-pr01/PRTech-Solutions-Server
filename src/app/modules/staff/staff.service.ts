/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../auth/auth.model";
import { TStaff } from "./staff.interface";
import { Staff } from "./staff.model";
import mongoose from "mongoose";

const getAllStaffs = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { designation: { $regex: search, $options: "i" } },
      { workArea: { $regex: search, $options: "i" } },
    ];
  }

  const staffs = await Staff.find(filter)
    .populate("userId", "name email phoneNumber gender country city address")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Staff.countDocuments(filter);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    staffs,
  };
};

const getSingleStaff = async (id: string) => {
  return await Staff.findById(id).populate(
    "userId",
    "name email phoneNumber gender country city address"
  );
};

const updateStaff = async (id: string, payload: Partial<TStaff>) => {
  // Find staff first
  const staff = await Staff.findById(id);
  if (!staff) throw new AppError(httpStatus.NOT_FOUND, "Staff not found");

  // Extract user fields
  const userFields: any = {};
  const staffFields: any = {};

  // Allowed user fields
  const userAllowedFields = [
    "name",
    "email",
    "phoneNumber",
    "gender",
    "country",
    "city",
    "address",
  ];

  // Allowed staff fields
  const staffAllowedFields = ["pagesAssigned", "jobRole"];

  // Separate payload into two objects
  Object.keys(payload).forEach((key) => {
    if (userAllowedFields.includes(key)) {
      userFields[key] = (payload as any)[key];
    }
    if (staffAllowedFields.includes(key)) {
      staffFields[key] = (payload as any)[key];
    }
  });

  // Update user model if user fields exist
  if (Object.keys(userFields).length > 0) {
    await User.findByIdAndUpdate(staff.userId, userFields, { new: true });
  }

  // Update staff model if staff fields exist
  let updatedStaff = null;
  if (Object.keys(staffFields).length > 0) {
    updatedStaff = await Staff.findByIdAndUpdate(id, staffFields, {
      new: true,
    }).populate("userId", "name email phoneNumber gender country city address");
  } else {
    // If only user updated, re-fetch populated data
    updatedStaff = await Staff.findById(id).populate(
      "userId",
      "name email phoneNumber gender country city address"
    );
  }

  return updatedStaff;
};

const deleteStaff = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);

  const staff = await Staff.findOne({ userId: objectId });
  if (!staff) throw new Error("Staff not found");

  // Delete from Staff collection first
  await Staff.findOneAndDelete({ userId: objectId });

  // Delete from User collection next
  await User.findByIdAndDelete(objectId);

  return { message: "Staff and related User deleted successfully" };
};

export const StaffService = {
  getAllStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
