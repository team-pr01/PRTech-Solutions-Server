import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "./auth.constants";
import { multerUpload } from "../../config/multer.config";
// import { upload } from "../../utils/sendImageToCloudinary";
const router = express.Router();

router.post("/add-staff", auth(UserRole.admin), AuthControllers.addStaff);
router.post(
  "/signup",
  multerUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "panCardFrontImage", maxCount: 1 },
    { name: "panCardBackImage", maxCount: 1 },
  ]),
  AuthControllers.signup
);

router.post(
  "/login",
  validateRequest(AuthValidations.LoginValidationSchema),
  AuthControllers.loginUser
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post("/forgot-password", AuthControllers.forgetPassword);

router.post(
  "/reset-password/:token",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.user),
  AuthControllers.changePassword
);

router.put(
  "/change-role",
  auth(UserRole.admin),
  AuthControllers.changeUserRole
);

export const AuthRoute = router;
