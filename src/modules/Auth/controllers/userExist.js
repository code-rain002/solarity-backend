import { successResponse, errorResponse, getProfileData } from "../../../utils";
import UserModel from "../../User/model";

export const checkUserExistController = async (req, res) => {
  try {
    const { publicKey, walletType } = req.body;

    let user = null;
    if (walletType == "solana") {
      user = await UserModel.findOne({ solanaAddress: publicKey });
    } else if (walletType == "ethereum") {
      console.log('ethereum wallet');
    }

    if (!!user) {
      return successResponse({ res, response: { exist: true } });
    } else {
      return successResponse({ res, response: { exist: false } });
    }
  } catch (err) {
    return errorResponse({ res, err });
  }
};
