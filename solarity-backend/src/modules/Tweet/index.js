import express from "express";
import { validateSchema } from "../../middlewares";
import { getTweets } from "./controller";
import { getTweetsSchema } from "./schema";

const router = express.Router();

router.get(
  "/",
  validateSchema(getTweetsSchema, { includeQuery: true }),
  getTweets
);

export { router as tweetModule };
