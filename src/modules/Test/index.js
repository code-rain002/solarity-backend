import express from "express";
import { validateSchema } from "../../middlewares";
import { getCollections, getTweets } from "./controller";

const router = express.Router();

// OK
router.get(
  "/tweets/:username",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  getTweets
);

router.get(
  "/collections/:symbol",
  validateSchema(null, { idParamCheck: true, idName: "symbol" }),
  getCollections
);

export { router as testModule };
