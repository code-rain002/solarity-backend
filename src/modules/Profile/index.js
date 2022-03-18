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
  claimProfitDaoController,
  updateProfileImageFromNftController,
} from "./controller";
import {
  updatePasswordSchema,
  updatePublicAddressSchema,
  updateProfileImageSchema,
  updateProfileSchema,
  initProfileSchema,
  nftProfilePicSchema,
} from "./schema";

const router = express.Router();

// OK
router.get("/", getProfileController);

router.post(
  "/init",
  validateSchema(initProfileSchema),
  updateProfileController
);

router.post("/claimDao", claimProfitDaoController);

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

router.post(
  "/nftProfilePic",
  validateSchema(nftProfilePicSchema),
  updateProfileImageFromNftController
);

// OK
router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updatePublicAddressController
);

export { router as profileModule };
