import { successResponse, errorResponse, checkIfOwnsNft } from "../../../utils";
import UserModel from "../../User/model";
import { isProfileVisible } from "../helpers";

export const claimDaosController = async (req, res) => {
  try {
    const {
      session: { userId },
    } = req;
    // // steps of claiming will come here, when ready
    // const ownsNft = await checkIfOwnsNft(profile.publicAddress);
    // const updateObject = {
    //   stepsCompleted: {
    //     ...profile.stepsCompleted,
    //     daoClaimed: true,
    //     profilePicUpdated: ownsNft
    //       ? profile.stepsCompleted.profilePicUpdated || false
    //       : true,
    //   },
    // };
    let profile = await req.profile();
    profile.stepsCompleted.daoClaimed = true;
    const visible = isProfileVisible(profile);
    profile.visible = visible;
    await UserModel.updateOne(
      { _id: userId },
      { "stepsCompleted.daoClaimed": true, visible }
    );
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
