import {
  successResponse,
  errorResponse,
  throwError,
  checkIfOwnsEthereumNft,
  checkIfOwnsSolanaNft,
} from "../../../utils";
import _ from "lodash";
import UserModel from "../../User/model";

const ACTION_MAP = {
  info: "infoAdded",
  link: "accountsLinked",
  profilePic: "profilePicUpdated",
  dao: "daoClaimed",
};

export const undoSetupController = async (req, res) => {
  try {
    let {
      body: { stepName },
    } = req;
    const profile = await req.profile();
    console.log("profile -- START");
    console.log(profile);
    console.log("profile -- END");
    if (profile.visible) throwError("You cannot undo the setup");

    if (stepName == "profilePic") {
      const { solanaAddress, ethereumAddress } = profile;
      let nftsOwned = false;
      if (solanaAddress) nftsOwned = await checkIfOwnsSolanaNft(solanaAddress);
      if (!nftsOwned && ethereumAddress)
        nftsOwned = await checkIfOwnsEthereumNft(ethereumAddress);
      if (!nftsOwned) {
        stepName = "link";
      }
    }

    profile.stepsCompleted[ACTION_MAP[stepName]] = false;
    await UserModel.updateOne(
      { _id: profile._id },
      { ["stepsCompleted." + ACTION_MAP[stepName]]: false }
    );
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
