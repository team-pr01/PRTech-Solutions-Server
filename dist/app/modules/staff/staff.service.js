"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("../auth/auth.model");
const staff_model_1 = require("./staff.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllStaffs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
        filter.$or = [
            { designation: { $regex: search, $options: "i" } },
            { workArea: { $regex: search, $options: "i" } },
        ];
    }
    const staffs = yield staff_model_1.Staff.find(filter)
        .populate("userId", "name email phoneNumber gender country city address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield staff_model_1.Staff.countDocuments(filter);
    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        staffs,
    };
});
const getSingleStaff = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield staff_model_1.Staff.findById(id).populate("userId", "name email phoneNumber gender country city address");
});
const updateStaff = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find staff first
    const staff = yield staff_model_1.Staff.findById(id);
    if (!staff)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Staff not found");
    // Extract user fields
    const userFields = {};
    const staffFields = {};
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
            userFields[key] = payload[key];
        }
        if (staffAllowedFields.includes(key)) {
            staffFields[key] = payload[key];
        }
    });
    // Update user model if user fields exist
    if (Object.keys(userFields).length > 0) {
        yield auth_model_1.User.findByIdAndUpdate(staff.userId, userFields, { new: true });
    }
    // Update staff model if staff fields exist
    let updatedStaff = null;
    if (Object.keys(staffFields).length > 0) {
        updatedStaff = yield staff_model_1.Staff.findByIdAndUpdate(id, staffFields, {
            new: true,
        }).populate("userId", "name email phoneNumber gender country city address");
    }
    else {
        // If only user updated, re-fetch populated data
        updatedStaff = yield staff_model_1.Staff.findById(id).populate("userId", "name email phoneNumber gender country city address");
    }
    return updatedStaff;
});
const deleteStaff = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    const staff = yield staff_model_1.Staff.findOne({ userId: objectId });
    if (!staff)
        throw new Error("Staff not found");
    // Delete from Staff collection first
    yield staff_model_1.Staff.findOneAndDelete({ userId: objectId });
    // Delete from User collection next
    yield auth_model_1.User.findByIdAndDelete(objectId);
    return { message: "Staff and related User deleted successfully" };
});
exports.StaffService = {
    getAllStaffs,
    getSingleStaff,
    updateStaff,
    deleteStaff,
};
