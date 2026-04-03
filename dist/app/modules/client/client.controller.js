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
exports.ClientControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const client_services_1 = require("./client.services");
// Add Client
const addClient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_services_1.ClientServices.addClient(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Client added successfully",
        data: result,
    });
}));
// Get All Clients
const getAllClients = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, source, industry, page, limit } = req.query;
    const result = yield client_services_1.ClientServices.getAllClients({
        keyword: keyword,
        status: status,
        source: source,
        industry: industry,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Clients retrieved successfully",
        data: result,
    });
}));
// Get Single Client
const getSingleClient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const result = yield client_services_1.ClientServices.getSingleClient(clientId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client retrieved successfully",
        data: result,
    });
}));
// Update Client
const updateClient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const result = yield client_services_1.ClientServices.updateClient(clientId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client updated successfully",
        data: result,
    });
}));
// Delete Client (Soft Delete)
const deleteClient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const result = yield client_services_1.ClientServices.deleteClient(clientId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client deleted successfully",
        data: result,
    });
}));
// Add Subordinate to Client
const addSubordinate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const result = yield client_services_1.ClientServices.addSubordinate(clientId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Subordinate added successfully",
        data: result,
    });
}));
// Update Subordinate
const updateSubordinate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, subordinateId } = req.params;
    const result = yield client_services_1.ClientServices.updateSubordinate(clientId, subordinateId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subordinate updated successfully",
        data: result,
    });
}));
// Delete Subordinate
const deleteSubordinate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, subordinateId } = req.params;
    const result = yield client_services_1.ClientServices.deleteSubordinate(clientId, subordinateId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subordinate deleted successfully",
        data: result,
    });
}));
exports.ClientControllers = {
    addClient,
    getAllClients,
    getSingleClient,
    updateClient,
    deleteClient,
    addSubordinate,
    updateSubordinate,
    deleteSubordinate,
};
