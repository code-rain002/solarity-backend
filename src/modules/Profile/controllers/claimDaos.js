import {
  successResponse,
  errorResponse,
  checkIfOwnsNft,
} from "../../../helpers";
import UserModel from "../../User/model";
import { isProfileVisible } from "../helpers";

export const claimDaosController = async (req, res) => {
  try {
    const {
      session: { userId },
    } = req;
    let profile = await req.profile();
    // steps of claiming will come here, when ready
    const ownsNft = await checkIfOwnsNft(profile.publicAddress);
    const updateObject = {
      stepsCompleted: {
        ...profile.stepsCompleted,
        daoClaimed: true,
        profilePicUpdated: ownsNft
          ? profile.stepsCompleted.profilePicUpdated || false
          : true,
      },
    };
    const visible = isProfileVisible(updateObject);
    profile = { ...profile, ...updateObject, visible };
    await UserModel.updateOne({ _id: userId }, { ...updateObject, visible });
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
