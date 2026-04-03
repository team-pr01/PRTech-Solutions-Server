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
exports.ProjectServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const project_model_1 = __importDefault(require("./project.model"));
const infinitePaginate_1 = require("../../utils/infinitePaginate");
const client_model_1 = __importDefault(require("../client/client.model"));
// Add Project
const addProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, name, projectType, status } = payload;
    // Check if client exists
    const clientExists = yield client_model_1.default.findById(clientId);
    if (!clientExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    // Check if project with same name exists for this client
    const existingProject = yield project_model_1.default.findOne({ name, clientId });
    if (existingProject) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Project with this name already exists for this client");
    }
    const payloadData = {
        name,
        projectType,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status,
        priceCurrency: payload.priceCurrency,
        price: payload.price,
        installments: payload.installments || [],
        dueAmount: payload.price,
        phases: payload.phases || [],
        onGoingPhase: payload.onGoingPhase,
        timelineLink: payload.timelineLink,
        contactPerson: payload.contactPerson || [],
        notes: payload.notes,
        clientId,
    };
    const result = yield project_model_1.default.create(payloadData);
    return result;
});
// Get all projects with filtering and pagination
const getAllProjects = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (name, description, phases)
    if (filters.keyword) {
        query.$or = [
            { name: { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
            { phases: { $regex: filters.keyword, $options: "i" } },
            { clientId: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = {
            $regex: `^${filters.status.trim()}$`,
            $options: "i",
        };
    }
    // PROJECT TYPE FILTER
    if (filters.projectType) {
        query.projectType = {
            $regex: `^${filters.projectType.trim()}$`,
            $options: "i",
        };
    }
    return (0, infinitePaginate_1.infinitePaginate)(project_model_1.default, query, skip, limit, ["clientId"]);
});
// Get single project by id
const getSingleProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.default.findById(projectId).populate("clientId");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    return result;
});
// Update project
const updateProject = (projectId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProject = yield project_model_1.default.findById(projectId);
    if (!existingProject) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // If updating clientId, check if client exists
    if (payload.clientId) {
        const clientExists = yield client_model_1.default.findById(payload.clientId);
        if (!clientExists) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
        }
    }
    // If updating price or installments, recalculate dueAmount
    if (payload.price !== undefined || payload.installments !== undefined) {
        const newPrice = payload.price !== undefined ? payload.price : existingProject.price;
        const newInstallments = payload.installments !== undefined ? payload.installments : existingProject.installments;
        if (newPrice && newInstallments) {
            const totalPaid = newInstallments.reduce((sum, installment) => sum + installment.amount, 0);
            payload.dueAmount = newPrice - totalPaid;
        }
        else if (newPrice) {
            payload.dueAmount = newPrice;
        }
    }
    const result = yield project_model_1.default.findByIdAndUpdate(projectId, payload, {
        new: true,
        runValidators: true,
    }).populate("clientId");
    return result;
});
// Delete project (Hard delete)
const deleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.default.findByIdAndDelete(projectId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    return result;
});
exports.ProjectServices = {
    addProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
};
