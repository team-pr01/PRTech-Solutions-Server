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
}, { timestamps: true });
exports.Staff = (0, mongoose_1.model)("Staff", StaffSchema);
