import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import { registerUser, loginUser, logoutUser, checkLogin } from "./controller";
import { LoginUserSchema, RegisterUserSchema } from "./schema";

const router = express.Router();

router.post("/register", validateSchema(RegisterUserSchema), registerUser);

router.post("/login", validateSchema(LoginUserSchema), loginUser);

router.get("/check", authenticate, checkLogin);

router.post("/logout", logoutUser);

// later!
// /register
// /resetPassword

export { router as authModule };
