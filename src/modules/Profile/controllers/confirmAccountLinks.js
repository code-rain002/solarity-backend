import UserModel from "../../User/model";
import {
  successResponse,
  errorResponse,
  checkIfOwnsNft,
  checkIfOwnsSolanaNft,
  checkIfOwnsEthereumNft,
  isProfileVisible,
  getProfileData,
} from "../../../utils";

export const confirmAccountLinksController = async (req, res, next) => {
  try {
    const {
      session: { userId },
      body: { action },
    } = req;
    if (action !== "link") return next();

    let userData = await req.profile();
    userData.stepsCompleted.accountsLinked = true;
    const visible = isProfileVisible(userData);
    userData.visible = visible;
    await UserModel.updateOne(
      { _id: userId },
      { "stepsCompleted.accountsLinked": true, visible }
    );

    const { solanaAddress, ethereumAddress } = userData;

    let nftsOwned = false;

    if (solanaAddress) {
      nftsOwned = await checkIfOwnsSolanaNft(solanaAddress);
    }

    if (!nftsOwned && ethereumAddress) {
      nftsOwned = await checkIfOwnsEthereumNft(ethereumAddress);
    }

    if (!nftsOwned) {
      userData.stepsCompleted.profilePicUpdated = true;
      const visible = isProfileVisible(userData);
      userData.visible = visible;
      await UserModel.updateOne(
        { _id: userId },
        { "stepsCompleted.profilePicUpdated": true, visible }
      );
    }
    userData.stepsCompleted.daoClaimed = true;
    const newVisible = isProfileVisible(userData);
    await UserModel.updateOne(
      { _id: userId },
      { "stepsCompleted.daoClaimed": true, visible: newVisible }
    );
    const profile = await getProfileData(userId);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
