import express from "express";
import { validateSchema } from "../../middlewares";
import { getNftOwned, getProfile, updatePublicAddress } from "./controller";
import { updatePublicAddressSchema } from "./schema";

const router = express.Router();

router.get("/", getProfile);

router.get("/nftOwned", getNftOwned);

router.post(
  "/updatePublicAddress",
  validateSchema(updatePublicAddressSchema),
  updatePublicAddress
);

export { router as profileObject };
