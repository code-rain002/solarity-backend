import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkLogin,
  test,
} from "./controller";
import { LoginUserSchema, RegisterUserSchema } from "./schema";

const router = express.Router();

router.post("/register", validateSchema(RegisterUserSchema), registerUser);

router.post("/login", validateSchema(LoginUserSchema), loginUser);

router.get("/check", authenticate, checkLogin);

router.post("/logout", logoutUser);

router.get("/", test);

// later!
// /register
// /resetPassword

export { router as authModule };
