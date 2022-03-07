import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getProfile,
  updateProfile,
  updatePassword,
  connectTwitter,
} from "./controller";
import {
  updatePasswordSchema,
  updatePublicAddressSchema,
  updateProfileSchema,
  connectTwitterSchema,
} from "./schema";

const router = express.Router();

router.get("/", getProfile);

router.post("/", validateSchema(updateProfileSchema), updateProfile);

router.post("/password", validateSchema(updatePasswordSchema), updatePassword);

router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updateProfile
);

router.post("/twitter", validateSchema(connectTwitterSchema), connectTwitter);

export { router as profileModule };
