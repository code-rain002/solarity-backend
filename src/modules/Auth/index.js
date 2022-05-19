import { RouteModule } from "../RouteModuleClass";
import {
  loginUserController,
  logoutUserController,
  provideUserDataController,
} from "./controllers";
import { LoginUserSchema } from "./schema";

class AuthModule extends RouteModule {
  publicRoutes() {
    // check the session of the user and provide data
    this.router.get("/check", provideUserDataController);

    // login/register the user
    this.router.post(
      "/login",
      this.validateSchema(LoginUserSchema),
      loginUserController,
      provideUserDataController
    );
  }

  privateRoutes() {
    this.router.post("/logout", logoutUserController);
  }
}

export const authModule = new AuthModule();
