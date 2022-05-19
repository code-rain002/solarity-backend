import { getTweetsController } from "./controllers";
import { getTweetsSchema } from "./schema";
import { RouteModule } from "../RouteModuleClass";

class TweetModule extends RouteModule {
  privateRoutes() {
    this.router.get(
      "/",
      this.validateSchema(getTweetsSchema, { includeQuery: true }),
      getTweetsController
    );
  }
}

export const tweetModule = new TweetModule();
