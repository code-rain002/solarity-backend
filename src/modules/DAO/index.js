import { RouteModule } from "../RouteModuleClass";
import {
  followDaoController,
  getDaoAnnouncementsController,
  getDaoFollowingStatusController,
  getDaosController,
  getSingleDaoController,
  unfollowDaoController,
  getDaoTokensController,
  getDaoController,
  getDaoByAddressController
} from "./controllers";
import { getDaosSchema, getDaoSchema } from "./schema";

class DaoModule extends RouteModule {
  publicRoutes() {
    //get all daos on the system
    this.router.get(
      "/",
      this.validateSchema(getDaosSchema, { includeQuery: true }),
      getDaosController
    );

    // all the token associated with daos
    this.router.get("/tokens", getDaoTokensController);

    // get a DAO using the associated magic eden symbol
    this.router.get(
      "/:symbol",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      getDaoController
    );

    this.router.get(
      "/:address/address",
      this.validateSchema(getDaoSchema, { includeQuery: true }),
      getDaoByAddressController
    );
  }

  privateRoutes() {
    // check if use is following a dao
    this.router.get(
      "/:symbol/follow",
      this.validateSchema(getDaoSchema, { idParamCheck: true, idName: "symbol" }),
      getDaoFollowingStatusController
    );

    // follow a dao
    this.router.post(
      "/:symbol/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      followDaoController
    );

    // unfollow a dao
    this.router.post(
      "/:symbol/unfollow",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      unfollowDaoController
    );

    // get the discord announcements from the dao
    this.router.get(
      "/:symbol/announcements",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      getDaoAnnouncementsController
    );
  }
}

export const daoModule = new DaoModule();
