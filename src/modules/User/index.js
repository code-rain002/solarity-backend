import express from "express";
import { authenticate, validateSchema } from "../../middlewares";
import {
  followUserController,
  getUserController,
  getUserFollowingStatusController,
  getUsersController,
  unfollowUserController,
} from "./controller";
import { getUsersSchema } from "./schema";

const router = express.Router();

// OK
router.get(
  "/",
  validateSchema(getUsersSchema, { includeQuery: true }),
  getUsersController
);

// get user
router.get(
  "/:username",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  getUserController
);

// check if following user
router.get(
  "/:username/follow",
  authenticate,
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  getUserFollowingStatusController
);

// follow user
router.post(
  "/:username/follow",
  authenticate,
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  followUserController
);

// unfollow user
router.post(
  "/:username/unfollow",
  authenticate,
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  unfollowUserController
);

export { router as userModule };
