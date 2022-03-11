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

router.get(
  "/:username",
  validateSchema(getTweetsUsernameSchema),
  getTweetsByUsername
);

export { router as tweetModule };
