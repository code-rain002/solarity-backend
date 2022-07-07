import { RouteModule } from "../RouteModuleClass";
import { getUserSchema, getUsersSchema } from "./schema";

import {
  getAllUsersController,
  getUserWithWalletAddressController,
  getUserInfoController,
  getUserFollowersController,
  getLinkInfoController,
  getUsersController,
  followUserController,
  unfollowUserController,
  getFollowingStatusController,
  getUserController,
  getRoomInfoController,
  getSelectedRoomInfoController
} from "./controllers";

class UserModule extends RouteModule {
  publicRoutes() {
    // get all users on the system
    this.router.get(
      "/",
      this.validateSchema(getUsersSchema, { includeQuery: true }),
      getUsersController
    );

    // get a user using the wallet address
    this.router.get("/wallet/:address", getUserWithWalletAddressController);

    // GOOD TO GO
    this.router.get("/getLinkInfo/:link", getLinkInfoController);

    // GOOD TO GO
    this.router.get("/getRoomInfo/:name/:roomNo", getRoomInfoController);

    // Get Selected live room info.
    this.router.get("/getSelectedRoomInfo/:roomNo", getSelectedRoomInfoController);

    // REDUNDANT with the GET / endpoint. Confirm removal later
    this.router.get("/getUsers", getAllUsersController);

    // REDUNDANT with the GET /:id endpoint. Confirm removal later
    this.router.get("/getUserInfo/:name", getUserInfoController);

    // get all the followers of a user
    this.router.get(
      "/:username/followers",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getUserFollowersController
    );
    // get a user by id
    this.router.get(
      "/:id",
      this.validateSchema(getUserSchema, { includeQuery: true }),
      getUserController
    );
  }

  privateRoutes() {
    // get following status
    this.router.get(
      "/:username/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getFollowingStatusController
    );

    // follow a user
    this.router.post(
      "/:username/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      followUserController
    );

    // unfollow a user
    this.router.post(
      "/:username/unfollow",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      unfollowUserController
    );
  }
}

export const userModule = new UserModule();
