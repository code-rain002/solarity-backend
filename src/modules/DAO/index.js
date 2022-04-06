import { errorResponse, successResponse } from "../../helpers";
import { RouteModule } from "../RouteModuleClass";
import {
  followDaoController,
  getDaoFollowingStatusController,
  getDaosController,
  getMemberDaos,
  getSingleDaoController,
  unfollowDaoController,
} from "./controllers";
import DaoModel from "./model";
import { getDaosSchema } from "./schema";

class DaoModule extends RouteModule {
  publicRoutes() {
    this.router.get(
      "/member/:username",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      getMemberDaos
    );
    this.router.get(
      "/",
      this.validateSchema(getDaosSchema, { includeQuery: true }),
      getDaosController
    );

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
  }
}

export const daoModule = new DaoModule();
