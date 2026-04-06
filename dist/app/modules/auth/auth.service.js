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
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const auth_model_1 = require("./auth.model");
const sendEmail_1 = require("../../utils/sendEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const staff_model_1 = require("../staff/staff.model");
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const isUserExists = yield auth_model_1.User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists.");
    }
    ;
    const result = yield auth_model_1.User.create(payload);
    return result;
});
// Login
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists or not
    const user = yield auth_model_1.User.isUserExists(payload.email);
    if (!(yield user)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Checking if the user already deleted or not
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Checking if the user suspended or not
    const isUserSuspended = user === null || user === void 0 ? void 0 : user.isSuspended;
    if (isUserSuspended) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are suspended! Please contact at the support center.");
    }
    // Checking if the password is correct or not
    if (!(yield auth_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password is not correct.");
    }
    // Create token and send to client/user
    const jwtPayload = {
        _id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        },
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if there is any token sent from the client or not.
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to proceed!");
    }
    // Checking if the token is valid or not.
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield auth_model_1.User.isUserExists(email);
    // Checking if the user exists or not
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Checking if the user already deleted or not
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Have to check if the user is suspended or not
    const jwtPayload = {
        _id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatar: user.avatar || [],
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const jwtPayload = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || [],
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    const resetLink = `${config_1.default.reset_password_ui_url}/reset-password?email=${user === null || user === void 0 ? void 0 : user.email}&token=${resetToken}`;
    const subject = "Reset Your Password - PRTEch Solutions";
    const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <h2 style="color:#06a0ed; text-align:center; margin-bottom:20px;">
        PRTEch Solutions
      </h2>

      <p style="font-size:16px; color:#333;">
        Hello <strong>${user.name}</strong>,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        We received a request to reset your password. Click the button below to set a new one.  
        This link will expire in <strong>10 minutes</strong>.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${resetLink}" 
          target="_blank"
          style="
            display:inline-block;
            background:#06a0ed;
            color:#ffffff;
            text-decoration:none;
            padding:12px 28px;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
          "
        >
          Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#777; line-height:1.5;">
        If you didn’t request this, you can ignore this email. Your password will remain unchanged.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

      <p style="font-size:14px; color:#999; text-align:center;">
        Need help? Contact our support team anytime.
      </p>

     <p style="font-size:16px; font-weight:bold; color:#06a0ed; text-align: center;">
          The Sampoorna Fresh Team
        </p>

    </div>
  </div>
`;
    yield (0, sendEmail_1.sendEmail)(user.email, subject, htmlBody);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExists(payload === null || payload === void 0 ? void 0 : payload.email);
    // Checking if the user exists or not
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the token is valid or not.
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    if ((payload === null || payload === void 0 ? void 0 : payload.email) !== (decoded === null || decoded === void 0 ? void 0 : decoded.email)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield auth_model_1.User.findOneAndUpdate({
        email: decoded.email,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId).select("+password");
    // Checking if the user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the current password is correct
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Current password is incorrect!");
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield auth_model_1.User.findByIdAndUpdate(userId, {
        password: newHashedPassword,
    });
});
// Change user role (For admin)
const changeUserRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield auth_model_1.User.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { role: payload === null || payload === void 0 ? void 0 : payload.role }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const addStaff = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, gender, country, city, address, password, pagesAssigned, jobRole, } = payload;
    const isUserExistsByEmail = yield auth_model_1.User.findOne({ email });
    if (isUserExistsByEmail) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists with this email");
    }
    const isUserExistsByPhone = yield auth_model_1.User.findOne({ phoneNumber });
    if (isUserExistsByPhone) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists with this phone number");
    }
    const user = yield auth_model_1.User.create({
        name,
        email,
        phoneNumber,
        gender,
        country,
        city,
        address,
        password,
        role: "staff",
        isOtpVerified: true,
        otp: null,
        otpExpireAt: null,
    });
    const staff = yield staff_model_1.Staff.create({
        userId: user._id,
        pagesAssigned: pagesAssigned || [],
        jobRole,
    });
    return { user, staff };
});
exports.AuthServices = {
    signup,
    loginUser,
    refreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
    changeUserRole,
    addStaff,
};
