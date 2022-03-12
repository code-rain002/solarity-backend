import express from "express";
import { validateSchema } from "../../middlewares";
import { upload } from "../../middlewares/multerMiddlewares";
import {
  updatePasswordController,
  getProfileController,
  updateProfileController,
  updateProfileImageController,
  updatePublicAddressController,
} from "./controller";
import {
  updatePasswordSchema,
  updatePublicAddressSchema,
  updateProfileImageSchema,
  updateProfileSchema,
} from "./schema";

const router = express.Router();

// OK
router.get("/", getProfileController);

// OK
router.post(
  "/password",
  validateSchema(updatePasswordSchema),
  updatePasswordController
);

// OK
router.patch("/", validateSchema(updateProfileSchema), updateProfileController);

// OK
router.post(
  "/image",
  upload("/profileImages").single("image"),
  updateProfileImageController
);

// OK
router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updatePublicAddressController
);

export { router as profileModule };
