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
const accounts_model_1 = __importDefault(require("../accounts/accounts.model"));
// Add Project
const addProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, name } = payload;
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
    const result = yield project_model_1.default.create(payload);
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
    var _a, _b;
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
    // Calculate project pending amount from phases if phases are being updated
    if (payload.phases !== undefined) {
        const totalPhasePending = payload.phases.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0);
        payload.pendingAmount = totalPhasePending;
    }
    // If price is being updated, recalculate pending amount based on phases
    if (payload.price !== undefined) {
        const totalPhasePending = ((_a = existingProject.phases) === null || _a === void 0 ? void 0 : _a.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0)) || 0;
        // If no phases exist, set pending amount to the new price
        if (totalPhasePending === 0 && ((_b = existingProject.phases) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            payload.pendingAmount = payload.price;
        }
    }
    // If phases are updated with new installments, recalculate phase pending amounts
    if (payload.phases !== undefined) {
        const updatedPhases = payload.phases.map(phase => {
            // Calculate pending amount for each phase based on its installments
            if (phase.installments && phase.installments.length > 0) {
                const totalPaid = phase.installments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
                const newPendingAmount = (phase.totalAmount || 0) - totalPaid;
                return Object.assign(Object.assign({}, phase), { pendingAmount: newPendingAmount >= 0 ? newPendingAmount : 0, paymentStatus: newPendingAmount <= 0 ? "Paid" : "Pending" });
            }
            return phase;
        });
        payload.phases = updatedPhases;
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
// Add a new phase to a project
const addPhase = (projectId, phaseData) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // Initialize phases array if it doesn't exist
    if (!project.phases) {
        project.phases = [];
    }
    // Add the new phase (MongoDB will auto-generate _id)
    project.phases.push(phaseData);
    // Recalculate project totals from all phases
    const totalPrice = project.phases.reduce((sum, phase) => sum + (phase.totalAmount || 0), 0);
    const totalPendingAmount = project.phases.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0);
    project.price = totalPrice;
    project.pendingAmount = totalPendingAmount;
    yield project.save();
    // Return the added phase with its _id
    const addedPhase = project.phases[project.phases.length - 1];
    return addedPhase;
});
// Update an existing phase by phaseId
const updatePhase = (projectId, phaseId, phaseData) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // Find phase by _id
    const phaseIndex = project.phases.findIndex((phase) => { var _a; return ((_a = phase._id) === null || _a === void 0 ? void 0 : _a.toString()) === phaseId; });
    if (phaseIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Phase not found");
    }
    // Get the current phase
    const currentPhase = project.phases[phaseIndex];
    // Update basic fields only (no installments)
    if (phaseData.name !== undefined)
        currentPhase.name = phaseData.name;
    if (phaseData.phaseStatus !== undefined)
        currentPhase.phaseStatus = phaseData.phaseStatus;
    if (phaseData.totalAmount !== undefined)
        currentPhase.totalAmount = phaseData.totalAmount;
    if (phaseData.startDate !== undefined)
        currentPhase.startDate = phaseData.startDate;
    if (phaseData.endDate !== undefined)
        currentPhase.endDate = phaseData.endDate;
    if (phaseData.pendingAmount !== undefined)
        currentPhase.pendingAmount = phaseData.pendingAmount;
    if (phaseData.paymentStatus !== undefined)
        currentPhase.paymentStatus = phaseData.paymentStatus;
    // If updating phase name and it was the ongoing phase, update project's onGoingPhase
    if (phaseData.name && project.onGoingPhase === currentPhase.name) {
        project.onGoingPhase = phaseData.name;
    }
    // Mark phases as modified
    project.markModified('phases');
    // Recalculate project totals from all phases
    let totalPrice = 0;
    let totalProjectPendingAmount = 0;
    for (const phase of project.phases) {
        totalPrice += phase.totalAmount || 0;
        totalProjectPendingAmount += phase.pendingAmount || 0;
    }
    // Update project totals
    project.price = totalPrice;
    project.pendingAmount = totalProjectPendingAmount;
    // Save the project
    yield project.save();
    // Return the updated phase
    return project.phases[phaseIndex];
});
// Add a single installment to a phase
const addInstallment = (projectId, phaseId, installmentData) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // Find phase by _id
    const phaseIndex = project.phases.findIndex((phase) => { var _a; return ((_a = phase._id) === null || _a === void 0 ? void 0 : _a.toString()) === phaseId; });
    if (phaseIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Phase not found");
    }
    // Get the current phase
    const currentPhase = project.phases[phaseIndex];
    // Initialize installments array if it doesn't exist
    if (!currentPhase.installments) {
        currentPhase.installments = [];
    }
    // Add the new installment
    currentPhase.installments.push(installmentData);
    // Recalculate phase pending amount based on ALL installments
    const totalPaid = (currentPhase.installments || []).reduce((sum, inst) => sum + (inst.amount || 0), 0);
    currentPhase.pendingAmount = currentPhase.totalAmount - totalPaid;
    currentPhase.paymentStatus = currentPhase.pendingAmount <= 0 ? "Paid" : "Pending";
    // Mark phases as modified
    project.markModified('phases');
    // Recalculate project totals from all phases
    let totalPrice = 0;
    let totalProjectPendingAmount = 0;
    for (const phase of project.phases) {
        totalPrice += phase.totalAmount || 0;
        totalProjectPendingAmount += phase.pendingAmount || 0;
    }
    // Update project totals
    project.price = totalPrice;
    project.pendingAmount = totalProjectPendingAmount;
    // Save the project
    yield project.save();
    // Return the updated phase
    return project.phases[phaseIndex];
});
// Update a specific installment in a phase
const updateInstallment = (projectId, phaseId, installmentId, installmentData) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // Find phase by _id
    const phaseIndex = project.phases.findIndex((phase) => { var _a; return ((_a = phase._id) === null || _a === void 0 ? void 0 : _a.toString()) === phaseId; });
    if (phaseIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Phase not found");
    }
    // Get the current phase
    const currentPhase = project.phases[phaseIndex];
    // Find the installment by _id
    const installmentIndex = currentPhase.installments.findIndex((inst) => { var _a; return ((_a = inst._id) === null || _a === void 0 ? void 0 : _a.toString()) === installmentId; });
    if (installmentIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Installment not found");
    }
    // Update the installment
    currentPhase.installments[installmentIndex] = Object.assign(Object.assign({}, currentPhase.installments[installmentIndex]), installmentData);
    // Recalculate phase pending amount based on ALL installments
    const totalPaid = (currentPhase.installments || []).reduce((sum, inst) => sum + (inst.amount || 0), 0);
    currentPhase.pendingAmount = currentPhase.totalAmount - totalPaid;
    currentPhase.paymentStatus = currentPhase.pendingAmount <= 0 ? "Paid" : "Pending";
    // Mark phases as modified
    project.markModified('phases');
    // Recalculate project totals from all phases
    let totalPrice = 0;
    let totalProjectPendingAmount = 0;
    for (const phase of project.phases) {
        totalPrice += phase.totalAmount || 0;
        totalProjectPendingAmount += phase.pendingAmount || 0;
    }
    // Update project totals
    project.price = totalPrice;
    project.pendingAmount = totalProjectPendingAmount;
    // Save the project
    yield project.save();
    // Return the updated phase
    return project.phases[phaseIndex];
});
// Delete a phase by phaseId
const deletePhase = (projectId, phaseId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    // Find phase by _id
    const phaseIndex = project.phases.findIndex((phase) => { var _a; return ((_a = phase._id) === null || _a === void 0 ? void 0 : _a.toString()) === phaseId; });
    if (phaseIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Phase not found");
    }
    const deletedPhase = project.phases[phaseIndex];
    // Remove the phase
    project.phases.splice(phaseIndex, 1);
    // If the deleted phase was the ongoing phase, clear or update onGoingPhase
    if (project.onGoingPhase === deletedPhase.name) {
        // Find next ongoing phase or clear
        const nextPhase = project.phases.find(p => p.phaseStatus === "Ongoing");
        project.onGoingPhase = (nextPhase === null || nextPhase === void 0 ? void 0 : nextPhase.name) || "";
    }
    // Recalculate project totals from remaining phases
    const totalPrice = project.phases.reduce((sum, phase) => sum + (phase.totalAmount || 0), 0);
    const totalPendingAmount = project.phases.reduce((sum, phase) => sum + (phase.pendingAmount || 0), 0);
    project.price = totalPrice;
    project.pendingAmount = totalPendingAmount;
    yield project.save();
    return {
        project,
        deletedPhase,
    };
});
// Get a single phase by phaseId
const getSinglePhase = (projectId, phaseId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    const phase = project.phases.find((phase) => { var _a; return ((_a = phase._id) === null || _a === void 0 ? void 0 : _a.toString()) === phaseId; });
    if (!phase) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Phase not found");
    }
    return phase;
});
// Get all phases of a project
const getAllPhases = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    return project.phases || [];
});
const addExpenditure = (projectId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    project.expenditures.push(payload);
    yield project.save();
    const account = yield accounts_model_1.default.create({
        type: "expense",
        expenseType: "project",
        currency: payload.currency,
        description: payload.description,
        totalAmount: payload.totalAmount,
        pendingAmount: payload.pendingAmount,
        paidAmount: payload.paidAmount,
        date: payload.date,
        paymentMethod: payload.paymentMethod
    });
    return account;
});
exports.ProjectServices = {
    addProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    addPhase,
    updatePhase,
    addInstallment,
    updateInstallment,
    deletePhase,
    getSinglePhase,
    getAllPhases,
    addExpenditure,
};
