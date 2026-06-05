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
exports.ProjectControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const project_services_1 = require("./project.services");
// Add Project
const addProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_services_1.ProjectServices.addProject(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Project added successfully",
        data: result,
    });
}));
// Get All Projects
const getAllProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, projectType, clientId, startDate, endDate, skip, limit } = req.query;
    const result = yield project_services_1.ProjectServices.getAllProjects({
        keyword: keyword,
        status: status,
        projectType: projectType,
        clientId: clientId,
        startDate: startDate,
        endDate: endDate,
    }, skip ? parseInt(skip) : 0, limit ? parseInt(limit) : 10);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result,
    });
}));
// Get Single Project
const getSingleProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.getSingleProject(projectId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project retrieved successfully",
        data: result,
    });
}));
// Update Project
const updateProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.updateProject(projectId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project updated successfully",
        data: result,
    });
}));
// Delete Project
const deleteProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.deleteProject(projectId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Project deleted successfully",
        data: result,
    });
}));
// Add Phase
const addPhase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.addPhase(projectId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Phase added successfully",
        data: result,
    });
}));
// Update Phase
const updatePhase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, phaseId } = req.params;
    const result = yield project_services_1.ProjectServices.updatePhase(projectId, phaseId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phase updated successfully",
        data: result,
    });
}));
// Add Installment to Phase
const addInstallment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, phaseId } = req.params;
    const result = yield project_services_1.ProjectServices.addInstallment(projectId, phaseId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Installment added successfully",
        data: result,
    });
}));
// Update Installment in Phase
const updateInstallment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, phaseId, installmentId } = req.params;
    const result = yield project_services_1.ProjectServices.updateInstallment(projectId, phaseId, installmentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Installment updated successfully",
        data: result,
    });
}));
// Delete Phase
const deletePhase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, phaseId } = req.params;
    const result = yield project_services_1.ProjectServices.deletePhase(projectId, phaseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phase deleted successfully",
        data: result,
    });
}));
// Get Single Phase
const getSinglePhase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, phaseId } = req.params;
    const result = yield project_services_1.ProjectServices.getSinglePhase(projectId, phaseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phase retrieved successfully",
        data: result,
    });
}));
// Get All Phases
const getAllPhases = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.getAllPhases(projectId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phases retrieved successfully",
        data: result,
    });
}));
const addExpenditure = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield project_services_1.ProjectServices.addExpenditure(projectId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Expenditure added successfully",
        data: result,
    });
}));
// Add phase to expenditure
const addPhaseToExpenditure = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, expenditureId } = req.params;
    const result = yield project_services_1.ProjectServices.addPhaseToExpenditure(projectId, expenditureId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Phase added to expenditure successfully",
        data: result,
    });
}));
// Get projects by client ID
const getProjectsByClientId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const result = yield project_services_1.ProjectServices.getProjectsByClientId(clientId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result,
    });
}));
exports.ProjectControllers = {
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
    addPhaseToExpenditure,
    getProjectsByClientId
};
