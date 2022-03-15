import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import { getTweets } from "./controller";

const router = express.Router();

// OK
router.get(
  "/tweets/:username",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  getTweets
);

export { router as testModule };
