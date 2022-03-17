import express from "express";
import { saveOwnedNfts } from "../../helpers/nftHelpers";
import { validateSchema } from "../../middlewares";
import { upload } from "../../middlewares/multerMiddlewares";
import UserModel from "../User/model";
import {
  updatePasswordController,
  getProfileController,
  updateProfileController,
  updateProfileImageController,
  updatePublicAddressController,
  initProfileController,
} from "./controller";
import {
  updatePasswordSchema,
  updatePublicAddressSchema,
  updateProfileImageSchema,
  updateProfileSchema,
  initProfileSchema,
} from "./schema";

const router = express.Router();

// OK
router.get("/", getProfileController);

router.post(
  "/init",
  validateSchema(initProfileSchema),
  updateProfileController
);

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
