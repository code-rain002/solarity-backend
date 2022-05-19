import { RouteModule } from "../RouteModuleClass";
import { getEthereumNFTsController } from "./controllers";
import { getNftsSchema } from "./schema";

class NftModule extends RouteModule {
  publicRoutes() {
    this.router.get(
      "/eth",
      this.validateSchema(getNftsSchema, { includeQuery: true }),
      getEthereumNFTsController
    );
  }
}

export const nftModule = new NftModule();
