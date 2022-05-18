import UserModel from "../../User/model";
import {
  successResponse,
  errorResponse,
  checkIfOwnsNft,
  checkIfOwnsSolanaNft,
  checkIfOwnsEthereumNft,
  isProfileVisible,
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
      userData.profilePicUpdated = true;
      const visible = isProfileVisible(userData);
      userData.visible = visible;
      await UserModel.updateOne(
        { _id: userId },
        { "stepsCompleted.profilePicUpdated": true, visible }
      );
    }

    return successResponse({ res, response: { profile: userData } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
