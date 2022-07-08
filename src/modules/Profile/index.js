import { RouteModule } from "../RouteModuleClass";
import {
  getProfileController,
  updateProfileInfoController,
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
  confirmAccountLinksController,
  updateUserInfoController // For new Solarity project (Domain, Title)
} from "./controllers";
import { getFollowingController } from "./controllers/getFollowing";
import { undoSetupController } from "./controllers/undoSetup";
import {
  updatePublicAddressSchema,
  updateProfileSchema,
  profilePicSchema,
  selectNftsForRoomSchema,
  linkAccountSchema,
  unlinkAccountSchema,
  buyRoomSchema,
  checkRoomSchema,
  setActiveRoomSchema,
  profileSetupSchema,
  profileInitSchema, // For new Solarity project
  profileImageUpdateSchema,
  getFollowingSchema,
  undoSetupSchema,
  updateUserInfoSchema // For new Solarity project (Domain, Title)
} from "./schema";

class ProfileModule extends RouteModule {
  privateRoutes() {
    // get profile
    this.router.get("/", getProfileController);

    // setup the profile
    this.router.post(
      "/setup",
      this.validateSchema(profileSetupSchema),
      updateProfileInfoController,
      confirmAccountLinksController,
      updateProfilePicController,
      claimDaosController
    );

    // setup the profile
    this.router.post(
      "/initProfile",
      this.validateSchema(profileInitSchema),
      updateUserInfoController,
      confirmAccountLinksController,
      updateProfilePicController,
      claimDaosController
    );

    // update profile
    this.router.patch(
      "/",
      this.validateSchema(updateProfileSchema),
      updateProfileInfoController
    );

    // For New Solarity Project
    // update profile
    this.router.patch(
      "/userInfo",
      this.validateSchema(updateUserInfoSchema),
      updateUserInfoController
    );

    // update profile pic using the nft
    this.router.post(
      "/profilePic",
      this.validateSchema(profileImageUpdateSchema),
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

    // SETUP ROUTE
    // claim the DAOs for the profile
    this.router.post("/setup/claimDaos", claimDaosController);

    // set the profile pic for the profile
    this.router.post(
      "/setup/setProfilePic",
      this.validateSchema(profileImageUpdateSchema),
      updateProfilePicController
    );

    this.router.post(
      "/setup/undo",
      this.validateSchema(undoSetupSchema),
      undoSetupController
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

    // Get the users and daos that the logged in user is following
    this.router.get(
      "/following",
      this.validateSchema(getFollowingSchema, { includeQuery: true }),
      getFollowingController
    );
  }
}

export const profileModule = new ProfileModule();
