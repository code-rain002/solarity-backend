import { RouteModule } from "../RouteModuleClass";
import {
  loginUserController,
  logoutUserController,
  provideUserDataController,
  checkUserExistController,
} from "./controllers";
import { LoginUserSchema, UserExistSchema } from "./schema";

class AuthModule extends RouteModule {
  publicRoutes() {
    // check the session of the user and provide data
    this.router.get("/check", provideUserDataController);

    /**
    * @name checkUserExist - Check if a user is exist with wallet address
    * @return {Object<{ exist: boolean }>}
    *
    * @example POST /auth/userExist { publicKey: ${publicKey}, walletType: ${walletType} }
    */
    this.router.post('/userExist',
      this.validateSchema(UserExistSchema),
      checkUserExistController
    );

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
