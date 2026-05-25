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
exports.NicheController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const niche_services_1 = require("./niche.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Add a niche
const addNiche = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield niche_services_1.NicheServices.addNiche(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Niche added successfully",
        data: result,
    });
}));
// Get all niches
const getAllNiches = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield niche_services_1.NicheServices.getAllNiches();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Niches fetched successfully",
        data: result,
    });
}));
// Get single niche by ID
const getSingleNicheById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nicheId } = req.params;
    const result = yield niche_services_1.NicheServices.getSingleNicheById(nicheId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Niche fetched successfully",
        data: result,
    });
}));
// Update niche by ID
const updateNiche = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nicheId } = req.params;
    const result = yield niche_services_1.NicheServices.updateNiche(nicheId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Niche updated successfully",
        data: result,
    });
}));
// Delete niche by ID
const deleteNiche = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nicheId } = req.params;
    const result = yield niche_services_1.NicheServices.deleteNiche(nicheId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Niche deleted successfully",
        data: result,
    });
}));
exports.NicheController = {
    addNiche,
    getAllNiches,
    getSingleNicheById,
    updateNiche,
    deleteNiche,
};
