import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    if (!user) {
      await res.session.destroy();
      throwError("Invalid Credentials");
    }
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const updatePublicAddress = async (req, res) => {
  try {
    const { userId } = req.session;
    const { publicAddress } = req.body;
    await UserModel.findByIdAndUpdate(userId, { publicAddress });
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftOwned = async (req, res) => {
  try {
    const theblockchainapi = req.app.get("theblockchainapi");
    const apiInstance = new theblockchainapi.SolanaWalletApi();
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    const { publicAddress } = user;
    const result = await apiInstance.solanaGetNFTsBelongingToWallet(
      "mainnet-beta",
      publicAddress
    );
    return successResponse({ res, response: { result } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// implement this
export const updatePassword = async (req, res) => {
  try {
  } catch (err) {}
};
