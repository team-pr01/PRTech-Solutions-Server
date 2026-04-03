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
exports.generateUniqueClientId = void 0;
const client_model_1 = __importDefault(require("../modules/client/client.model"));
const generateUniqueClientId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastClient = yield client_model_1.default.findOne({ clientId: /^PR/ })
        .sort({ clientId: -1 })
        .select("clientId")
        .lean();
    if (!lastClient || !lastClient.clientId) {
        return "PR01";
    }
    const lastNumber = parseInt(lastClient.clientId.replace("PR", ""), 10);
    const nextNumber = lastNumber + 1;
    // Pad with leading zeros (e.g., PR01, PR02, PR10, PR100)
    const paddedNumber = nextNumber.toString().padStart(2, "0");
    return `PR${paddedNumber}`;
});
exports.generateUniqueClientId = generateUniqueClientId;
