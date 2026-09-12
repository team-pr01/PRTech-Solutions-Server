"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const mongoose_1 = require("mongoose");
const StaffSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    pagesAssigned: {
        type: [String],
        default: [],
    },
    jobRole: { type: String, required: true },
    whatsappNumber: { type: String },
    bank: {
        bankName: { type: String, required: true },
        bankAccountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        bankPhoneNumber: { type: String },
    },
    panCardFrontImage: { type: String },
    panCardBackImage: { type: String },
}, { timestamps: true });
exports.Staff = (0, mongoose_1.model)("Staff", StaffSchema);
