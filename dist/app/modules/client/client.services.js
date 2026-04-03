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
exports.ClientServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_model_1 = __importDefault(require("./client.model"));
const generateUniqueClientId_1 = require("../../utils/generateUniqueClientId");
const infinitePaginate_1 = require("../../utils/infinitePaginate");
// Add client
const addClient = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, emails, phoneNumbers, country, source } = payload;
    // Check if client with same email already exists
    if (emails && emails.length > 0) {
        const existingClient = yield client_model_1.default.findOne({
            "emails.email": emails[0].email,
        });
        if (existingClient) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Client with this email already exists");
        }
    }
    // Generate unique client ID
    const clientId = yield (0, generateUniqueClientId_1.generateUniqueClientId)();
    const payloadData = {
        clientId,
        name,
        emails,
        phoneNumbers,
        country,
        source,
        socialMedia: payload.socialMedia,
        preferredContactMethod: payload.preferredContactMethod,
        languages: payload.languages,
        timezone: payload.timezone,
        address: payload.address,
        notes: payload.notes,
        industry: payload.industry,
        companySize: payload.companySize,
        subordinates: payload.subordinates || [],
    };
    const result = yield client_model_1.default.create(payloadData);
    return result;
});
// Get all clients with filtering and pagination
const getAllClients = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // SEARCH (name, email, clientId, subordinate name)
    if (filters.keyword) {
        query.$or = [
            { name: { $regex: filters.keyword, $options: "i" } },
            { clientId: { $regex: filters.keyword, $options: "i" } },
            { "emails.email": { $regex: filters.keyword, $options: "i" } },
            { "subordinates.name": { $regex: filters.keyword, $options: "i" } },
            { "subordinates.email": { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // STATUS FILTER
    if (filters.status) {
        query.status = {
            $regex: `^${filters.status.trim()}$`,
            $options: "i",
        };
    }
    // SOURCE FILTER
    if (filters.source) {
        query.source = {
            $regex: `^${filters.source.trim()}$`,
            $options: "i",
        };
    }
    // INDUSTRY FILTER
    if (filters.industry) {
        query.industry = {
            $regex: `^${filters.industry.trim()}$`,
            $options: "i",
        };
    }
    // CLIENT TYPE FILTER
    if (filters.clientType) {
        query.clientType = {
            $regex: `^${filters.clientType.trim()}$`,
            $options: "i",
        };
    }
    // COUNTRY FILTER
    if (filters.country) {
        query.country = {
            $regex: `^${filters.country.trim()}$`,
            $options: "i",
        };
    }
    return (0, infinitePaginate_1.infinitePaginate)(client_model_1.default, query, skip, limit, [] // populate fields if needed
    );
});
// Get single client by id
const getSingleClient = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_model_1.default.findById(clientId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    return result;
});
// Get client by clientId (PR01, PR02, etc.)
const getClientByClientId = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_model_1.default.findOne({ clientId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    return result;
});
// Update client
const updateClient = (clientId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingClient = yield client_model_1.default.findById(clientId);
    if (!existingClient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    // Check email uniqueness if updating emails
    if (payload.emails && payload.emails.length > 0) {
        const emailExists = yield client_model_1.default.findOne({
            _id: { $ne: clientId },
            "emails.email": payload.emails[0].email,
        });
        if (emailExists) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Client with this email already exists");
        }
    }
    const result = yield client_model_1.default.findByIdAndUpdate(clientId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Add subordinate to client
const addSubordinate = (clientId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield client_model_1.default.findById(clientId);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    client.subordinates = client.subordinates || [];
    client.subordinates.push(payload);
    yield client.save();
    return client;
});
// Update subordinate
const updateSubordinate = (clientId, subordinateId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = yield client_model_1.default.findById(clientId);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    const subordinateIndex = (_a = client.subordinates) === null || _a === void 0 ? void 0 : _a.findIndex((sub) => { var _a; return ((_a = sub._id) === null || _a === void 0 ? void 0 : _a.toString()) === subordinateId; });
    if (subordinateIndex === undefined || subordinateIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subordinate not found");
    }
    client.subordinates[subordinateIndex] = Object.assign(Object.assign({}, client.subordinates[subordinateIndex]), payload);
    yield client.save();
    return client;
});
// Delete subordinate
const deleteSubordinate = (clientId, subordinateId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const client = yield client_model_1.default.findById(clientId);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    const subordinateExists = (_a = client.subordinates) === null || _a === void 0 ? void 0 : _a.some((sub) => { var _a; return ((_a = sub._id) === null || _a === void 0 ? void 0 : _a.toString()) === subordinateId; });
    if (!subordinateExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subordinate not found");
    }
    client.subordinates = (_b = client.subordinates) === null || _b === void 0 ? void 0 : _b.filter((sub) => { var _a; return ((_a = sub._id) === null || _a === void 0 ? void 0 : _a.toString()) !== subordinateId; });
    yield client.save();
    return client;
});
// Soft delete client (instead of hard delete)
const deleteClient = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingClient = yield client_model_1.default.findById(clientId);
    if (!existingClient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    // Soft delete - you can add an isDeleted field to schema
    const result = yield client_model_1.default.findByIdAndDelete(clientId);
    return result;
});
exports.ClientServices = {
    addClient,
    getAllClients,
    getSingleClient,
    getClientByClientId,
    updateClient,
    deleteClient,
    addSubordinate,
    updateSubordinate,
    deleteSubordinate,
};
