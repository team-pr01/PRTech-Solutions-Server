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
exports.NicheServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const niche_model_1 = __importDefault(require("./niche.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Add a niche
const addNiche = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, subNiches } = payload;
    // Check if niche with same name already exists
    const existingNiche = yield niche_model_1.default.findOne({ name });
    if (existingNiche) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Niche with this name already exists");
    }
    const payloadData = {
        name,
        subNiches: subNiches || [],
    };
    const result = yield niche_model_1.default.create(payloadData);
    return result;
});
// Get all niches
const getAllNiches = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield niche_model_1.default.find().sort({ createdAt: -1 });
    return result;
});
// Get single niche by ID
const getSingleNicheById = (nicheId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield niche_model_1.default.findById(nicheId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Niche not found");
    }
    return result;
});
// Update niche by ID
const updateNiche = (nicheId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNiche = yield niche_model_1.default.findById(nicheId);
    if (!existingNiche) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Niche not found");
    }
    // If updating name, check for duplicate
    if (payload.name && payload.name !== existingNiche.name) {
        const duplicateNiche = yield niche_model_1.default.findOne({ name: payload.name });
        if (duplicateNiche) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Niche with this name already exists");
        }
    }
    // Handle subNiches: if subNiches is provided, merge with existing (avoid duplicates)
    if (payload.subNiches && payload.subNiches.length > 0) {
        // Create a Set to avoid duplicates
        const existingSubNiches = existingNiche.subNiches || [];
        const newSubNiches = payload.subNiches;
        // Merge and remove duplicates
        const mergedSubNiches = [...new Set([...existingSubNiches, ...newSubNiches])];
        payload.subNiches = mergedSubNiches;
    }
    const result = yield niche_model_1.default.findByIdAndUpdate(nicheId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete niche by ID
const deleteNiche = (nicheId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield niche_model_1.default.findByIdAndDelete(nicheId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Niche not found");
    }
    return result;
});
exports.NicheServices = {
    addNiche,
    getAllNiches,
    getSingleNicheById,
    updateNiche,
    deleteNiche,
};
