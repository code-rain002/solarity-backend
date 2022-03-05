import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import NftModel from "../NFT/model";
import { getNFTPrice } from "../../helpers/nftHelpers";
import md5 from "md5";

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

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.session;

    await UserModel.findByIdAndUpdate(userId, req.body);
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const {
      body: { newPassword, currentPassword },
      session: { userId },
    } = req;
    const user = await UserModel.findById(userId);
    const { password } = user;
    if (password != md5(currentPassword)) {
      throwError("The provided current password is invalid");
    }
    // check for password rules!!!!!
    await UserModel.findByIdAndUpdate(userId, { password: md5(newPassword) });
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};