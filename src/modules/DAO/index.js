import { errorResponse, successResponse } from "../../helpers";
import { RouteModule } from "../RouteModuleClass";
import { getDaosController, getSingleDaoController } from "./controllers";
import DaoModel from "./model";
import { getDaosSchema } from "./schema";

class DaoModule extends RouteModule {
  publicRoutes() {
    this.router.get("/d", async (req, res) => {
      try {
        const dao = await DaoModel.create({
          symbol: "chicken",
          name: "Chicken Boys",
          description:
            "4,444 Money Boys Building the metaverse. For the best insights and NFT analytic tools visit our platform.",
          supply: "4444",
          floorPrice: "20",
          token: "$MBC",
          stackingRewards: "130",
          nftCollection: [],
        });
        return successResponse({ res });
      } catch (err) {
        return errorResponse({ err, res });
      }
    });
    this.router.get(
      "/",
      this.validateSchema(getDaosSchema, { includeQuery: true }),
      getDaosController
    );
    this.router.get("/:symbol", getSingleDaoController);
  }
}

export const daoModule = new DaoModule();
