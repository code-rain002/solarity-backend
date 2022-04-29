import { TwitterApi } from "twitter-api-v2";
import { RouteModule } from "../RouteModuleClass";
import {
  getProfileController,
  updateProfileController,
  updatePublicAddressController,
  claimDaosController,
  updateProfilePicController,
  checkUsernameAvailabilityController,
  selectNftsForRoomController,
  linkAccountController,
  unlinkAccountController,
  buyRoomController,
  checkRoomController,
  setActiveRoomController,
} from "./controllers";
import {
  updatePublicAddressSchema,
  updateProfileSchema,
  setupProfileInfoSchema,
  profilePicSchema,
  selectNftsForRoomSchema,
  linkAccountSchema,
  unlinkAccountSchema,
  buyRoomSchema,
  checkRoomSchema,
  setActiveRoomSchema,
} from "./schema";

class ProfileModule extends RouteModule {
  privateRoutes() {
    // get profile details
    this.router.get("/", getProfileController);

    // update profile
    this.router.patch(
      "/",
      this.validateSchema(updateProfileSchema),
      updateProfileController
    );

    // update profile pic using the nft
    this.router.post(
      "/profilePic",
      this.validateSchema(profilePicSchema),
      updateProfilePicController
    );

    // update the public address of the profile
    this.router.post(
      "/publicAddress",
      this.validateSchema(updatePublicAddressSchema),
      updatePublicAddressController
    );

    // SETUP ROUTE
    // update the data for the profile
    this.router.post(
      "/setup/info",
      this.validateSchema(setupProfileInfoSchema),
      updateProfileController
    );

    // SETUP ROUTE
    // claim the DAOs for the profile
    this.router.post("/setup/claimDaos", claimDaosController);

    // set the profile pic for the profile
    this.router.post(
      "/setup/setProfilePic",
      this.validateSchema(profilePicSchema),
      updateProfilePicController
    );

    // get the username availability
    this.router.get(
      "/usernameAvailability/:username",
      this.validateSchema(null, { idParamCheck: true, idName: "username" }),
      checkUsernameAvailabilityController
    );

    // select nfts for display in a room
    this.router.post(
      "/selectNftsForRoom",
      this.validateSchema(selectNftsForRoomSchema),
      selectNftsForRoomController
    );

    // link profile to external accounts
    this.router.post(
      "/linkAccounts",
      this.validateSchema(linkAccountSchema),
      linkAccountController
    );
    // link profile to external accounts
    this.router.post(
      "/unlinkAccounts",
      this.validateSchema(unlinkAccountSchema),
      unlinkAccountController
    );

    // buy a room
    this.router.post(
      "/buyRoom",
      this.validateSchema(buyRoomSchema),
      buyRoomController
    );

    // check room with no
    this.router.post(
      "/checkRoom",
      this.validateSchema(checkRoomSchema),
      checkRoomController
    );

    // Set Active Room
    this.router.post(
      "/setActiveRoom",
      this.validateSchema(setActiveRoomSchema),
      setActiveRoomController
    );
  }
}

export const profileModule = new ProfileModule();
