import { successResponse, errorResponse, getProfileData } from "../../../utils";
import UserModel from "../../User/model";

export const checkStepController = async (req, res) => {
  try {
    const { userId } = req.session;

    const user = await UserModel.findOne({ _id: userId });
    const userInfo = {};
    // !user.solanaAddress ? userInfo.solanaAddress = '' : userInfo.solanaAddress;
    // !user.username ? userInfo.domain = '' : userInfo.domain;
    // !user.bio ? userInfo.title = '' : userInfo.title;
    // !user.daos ? userInfo.daos = [] : userInfo.daos;
    // !user.profileImage ? userInfo.profileImage = {} : userInfo.profileImage;
    // !user.badges ? userInfo.badges = [] : userInfo.badges;
    // !user.passportStyle ? userInfo.passportStyle = {} : userInfo.passportStyle;
    
    // if (!!user.solanaAddress) userInfo.solanaAddress = user.solanaAddress;
    // if (!!user.username) userInfo.domain = user.username;
    // if (!!user.bio) userInfo.title = user.bio;
    // if (!!user.daos) userInfo.daos = user.daos;
    // if (!!user.profileImage) userInfo.profileImage = user.profileImage;
    // if (!!user.badges) userInfo.badges = user.badges;
    // if (!!user.passportStyle) userInfo.passportStyle = user.passportStyle;

    return successResponse({ res, response: { user: user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
