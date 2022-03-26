import express from "express";
import { saveOwnedNfts } from "../../helpers/nftHelpers";
import { validateSchema } from "../../middlewares";
import { upload } from "../../middlewares/multerMiddlewares";
import UserModel from "../User/model";
import {
  getProfileController,
  updateProfilePicController,
  updateProfileController,
  updatePublicAddressController,
  claimProfitDaoController,
} from "./controller";
import {
  updatePublicAddressSchema,
  updateProfileSchema,
  setupProfileInfoSchema,
  profilePicSchema,
} from "./schema";

const router = express.Router();

// CHECKED
router.get("/", getProfileController);

// CHECKED
router.post(
  "/profilePic",
  validateSchema(profilePicSchema),
  updateProfilePicController
);

// OK
router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updatePublicAddressController
);

// ----

router.post(
  "/setup/info",
  validateSchema(setupProfileInfoSchema),
  updateProfileController
);

router.post("/claimDao", claimProfitDaoController);

// OK
router.patch("/", validateSchema(updateProfileSchema), updateProfileController);

export { router as profileModule };
