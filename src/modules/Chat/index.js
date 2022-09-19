import { RouteModule } from "../RouteModuleClass";

import {
  fetchChatsController,
  fetchMessagesController,
} from "./controllers";

class ChatModule extends RouteModule {
  publicRoutes() {
    // fetch chats
    this.router.get(
      "/fetchChats",
      fetchChatsController
    );
    
  }
  
  privateRoutes() {
    // get following status
    this.router.post(
      "/fetchMessages",
      fetchMessagesController
    );
  }
}

export const chatModule = new ChatModule();
