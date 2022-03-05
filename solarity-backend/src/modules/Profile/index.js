import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftOwned,
  getProfile,
  updateProfile,
  getNftWatchList,
  getCoinWatchList,
} from "./controller";
import {
  UpdateAddressSchema,
  UpdateCoinSchema,
  updatePublicAddressSchema,
} from "./schema";

const router = express.Router();

router.get("/", getProfile);

router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updateProfile()
);

export { router as profileModule };
