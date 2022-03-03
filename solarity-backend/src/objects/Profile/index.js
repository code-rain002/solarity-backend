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

router.get("/nftOwned", getNftOwned);

router.get("/nftWatchlist", getNftWatchList);
router.get("/coinWatchlist", getCoinWatchList);

router.post(
  "/publicAddress",
  validateSchema(updatePublicAddressSchema),
  updateProfile()
);

router.post(
  "/coinWatchlist",
  validateSchema(UpdateCoinSchema),
  updateProfile("coinWatchlist")
);

router.post(
  "/nftWatchlist",
  validateSchema(UpdateAddressSchema),
  updateProfile("nftWatchlist")
);

export { router as profileObject };
