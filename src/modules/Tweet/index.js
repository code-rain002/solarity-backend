import express from "express";
import { validateSchema } from "../../middlewares";
import { getTweets, getTweetsByUsername } from "./controller";
import { getTweetsSchema, getTweetsUsernameSchema } from "./schema";

const router = express.Router();

router.get(
  "/",
  validateSchema(getTweetsSchema, { includeQuery: true }),
  getTweets
);

export { router as tweetModule };
