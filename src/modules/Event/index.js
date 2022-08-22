import { RouteModule } from "../RouteModuleClass";
import { getEventsSchema, createEventSchema } from "./schema";

import {
  getEventsController,
  createEventController
} from "./controllers";

class EventModule extends RouteModule {
  publicRoutes() {
    // test
    this.router.get(
      "/test",
      (req, res) => { res.json("success") }
    );

    // get all events
    this.router.get(
      "/",
      this.validateSchema(getEventsSchema, { includeQuery: true }),
      getEventsController
    );

    this.router.post(
      "/",
      this.validateSchema(createEventSchema),
      createEventController
    );
  }

  privateRoutes() {
    // create event
    // this.router.post(
    //   "/",
    //   this.validateSchema(createEventSchema),
    //   createEventController
    // );
  }
}

export const eventModule = new EventModule();
