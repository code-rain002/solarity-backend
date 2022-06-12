import { RouteModule } from "../RouteModuleClass";
import CollectionModel from "./model";

class CollectionModule extends RouteModule {
  publicRoutes() {}
}

export const collectionModule = new CollectionModule();
