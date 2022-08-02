import {
  successResponse,
  errorResponse,
  getNftOwner,
  checkIfNftOwner,
  throwError,
  getNftImageLink,
  getProfileData,
} from "../../../utils";
import UserModel from "../../User/model";
import _ from "lodash";
import axios from "axios";
import { isProfileVisible } from "../helpers";

export const updateProfilePicController = async (req, res) => {
  try {
    const {
      body: { action, imageNetwork, skipImage },
      session: { userId },
    } = req;
    if (action !== undefined && action !== "profilePic") return next();
    let profile;
    if (skipImage) {
      profile = await req.profile();
      profile.stepsCompleted.profilePicUpdated = true;
      const visible = isProfileVisible(profile);
      await UserModel.updateOne(
        { _id: userId },
        {
          "stepsCompleted.profilePicUpdated": true,
          visible,
        }
      );
    }

    if (!skipImage) {
      const { solanaAddress, ethereumAddress } = await req.profile();
      const owned = await checkIfNftOwner({
        network: imageNetwork,
        ...req.body,
        publicAddress:
          imageNetwork == "Ethereum" ? ethereumAddress : solanaAddress,
      });
      if (!owned) throwError("The NFT is not owned by you");
      const imageUrl = await getNftImageLink({
        network: imageNetwork,
        ...req.body,
      });
      const profileImageUpdates = {
        link: imageUrl,
        network: imageNetwork,
        ...req.body,
      };
      profile = await req.profile();
      profile.stepsCompleted.profilePicUpdated = true;
      const visible = isProfileVisible(profile);
      await UserModel.updateOne(
        { _id: userId },
        {
          profileImage: profileImageUpdates,
          "stepsCompleted.profilePicUpdated": true,
          visible,
        }
      );
    }
    profile = await getProfileData(userId);

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
