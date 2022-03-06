import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import { loginUser, logoutUser, checkLogin } from "./controller";
import { LoginUserSchema } from "./schema";

const router = express.Router();

router.get("/check", authenticate, checkLogin);

router.post("/logout", logoutUser);

router.post("/login", validateSchema(LoginUserSchema), loginUser);

// later!
// /register
// /resetPassword

export { router as authModule };
