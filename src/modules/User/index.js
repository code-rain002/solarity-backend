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
import { RouteModule } from "../RouteModuleClass";
import { getUserFollowersController } from "./controllers";

class UserModule extends RouteModule {
  publicRoutes() {
    this.router.get(
      "/",
      this.validateSchema(getUsersSchema, { includeQuery: true }),
      getUsersController
    );
    this.router.get(
      "/:username",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getUserController
    );
    this.router.get(
      "/:username/followers",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getUserFollowersController
    );
  }
  privateRoutes() {
    this.router.get(
      "/:username/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getUserFollowingStatusController
    );
    this.router.post(
      "/:username/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      followUserController
    );
    this.router.post(
      "/:username/unfollow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      unfollowUserController
    );
  }
}

export const userModule = new UserModule();
