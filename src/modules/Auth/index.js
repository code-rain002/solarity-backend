import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  checkLoginController,
  LoginUserWithPublicAddressController,
  test,
  registerUserWithPublicAddressController,
} from "./controller";
import {
  LoginUserSchema,
  RegisterUserSchema,
  LoginUserWithPublicAddressSchema,
} from "./schema";

const router = express.Router();

// OK
router.get("/check", authenticate, checkLoginController);

// OK
router.post("/logout", logoutUserController);

// OK: ONLY FOR TESTING
router.get("/", test);

// OK
router.post("/login", validateSchema(LoginUserSchema), loginUserController);

// OK
router.post(
  "/login/wallet",
  validateSchema(LoginUserWithPublicAddressSchema),
  LoginUserWithPublicAddressController
);

// OK
router.post(
  "/register",
  validateSchema(RegisterUserSchema),
  registerUserController
);

router.post(
  "/register/wallet",
  validateSchema(LoginUserWithPublicAddressSchema),
  registerUserWithPublicAddressController
);

export { router as authModule };
