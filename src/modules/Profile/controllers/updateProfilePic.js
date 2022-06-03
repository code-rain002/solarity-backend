import {
  successResponse,
  errorResponse,
  getNftOwner,
  checkIfNftOwner,
  throwError,
  getNftImageLink,
} from "../../../utils";
import UserModel from "../../User/model";
import _ from "lodash";
import axios from "axios";
import { isProfileVisible } from "../helpers";

export const updateProfilePicController = async (req, res) => {
  try {
    const {
      body: { action, imageNetwork },
      session: { userId },
    } = req;
    if (action !== undefined && action !== "profilePic") return next();

    const { solanaAddress, ethereumAddress } = await req.profile();

    // confirm the ownership of the image
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

    let profile = await req.profile();
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

    profile = await req.profile();

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
