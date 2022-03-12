import express from "express";
import { validateSchema } from "../../middlewares";
import {
  followUserController,
  getUserController,
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

// follow user
router.post(
  "/:username/follow",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  followUserController
);

// unfollow user
router.post(
  "/:username/unfollow",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  unfollowUserController
);

export { router as userModule };
