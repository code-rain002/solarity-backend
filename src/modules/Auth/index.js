import express from "express";
import { authenticate, validateSchema } from "../../middlewares";

import {
  logoutUserController,
  checkLoginController,
  loginUserController,
} from "./controller";

import { LoginUserSchema } from "./schema";

const router = express.Router();

// OK
router.get("/check", authenticate, checkLoginController);

// OK
router.post("/logout", logoutUserController);

// OK
router.post("/login", validateSchema(LoginUserSchema), loginUserController);

export { router as authModule };
