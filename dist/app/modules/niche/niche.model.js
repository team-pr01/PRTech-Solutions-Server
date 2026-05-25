"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NicheSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    subNiches: {
        type: [String],
        required: true,
        default: [],
    },
}, {
    timestamps: true,
});
const Niche = (0, mongoose_1.model)("Niche", NicheSchema);
exports.default = Niche;
