import { RouteModule } from "../RouteModuleClass";
import {
  loginUserController,
  logoutUserController,
  provideUserDataController,
  checkUserExistController,
  domainAvailabilityController,
  registerController,
} from "./controllers";
import { LoginUserSchema, UserExistSchema, RegisterSchema } from "./schema";

class AuthModule extends RouteModule {
  publicRoutes() {
    // check the session of the user and provide data
    this.router.get("/check", provideUserDataController);

    /**
    * @name domainAvailability - Check if a domain is exist
    * @return {Object<{ available: boolean, reason: string }>}
    *
    * @example GET /auth/domainAvailability/:domain {}
    */
    this.router.get('/domainAvailability/:domain',
      this.validateSchema(null, { idParamCheck: true, idName: "domain" }),
      domainAvailabilityController
    );

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

    /**
    * @name register - Register
    * @return {Object<{ success: boolean }>}
    *
    * @example POST /auth/register { publicKey: ${publicKey}, walletType: ${walletType}, domain: ${domain}, bio: ${bio}, profileImage: ${profileImage} }
    */
    this.router.post('/register',
      this.validateSchema(RegisterSchema),
      registerController
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
