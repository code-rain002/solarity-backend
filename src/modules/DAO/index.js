import { errorResponse, successResponse } from "../../helpers";
import { RouteModule } from "../RouteModuleClass";
import {
  followDaoController,
  getDaoAnnouncementsController,
  getDaoFollowingStatusController,
  getDaosController,
  getDaoTokenAddressesController,
  getSingleDaoController,
  unfollowDaoController,
} from "./controllers";
import { getDaosSchema } from "./schema";

class DaoModule extends RouteModule {
  publicRoutes() {
    this.router.get(
      "/",
      this.validateSchema(getDaosSchema, { includeQuery: true }),
      getDaosController
    );

    this.router.get("/tokenAddresses", getDaoTokenAddressesController);

    this.router.get(
      "/:symbol",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      getSingleDaoController
    );
  }
  privateRoutes() {
    this.router.get(
      "/:symbol/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      getDaoFollowingStatusController
    );
    this.router.post(
      "/:symbol/follow",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      followDaoController
    );
    this.router.post(
      "/:symbol/unfollow",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      unfollowDaoController
    );
    this.router.get(
      "/:symbol/announcements",
      this.validateSchema(null, { idParamCheck: true, idName: "symbol" }),
      getDaoAnnouncementsController
    );
  }
}

export const daoModule = new DaoModule();
