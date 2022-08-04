import { successResponse, errorResponse, getProfileData } from "../../../utils";
import UserModel from "../../User/model";

export const registerController = async (req, res) => {
  try {
    const { publicKey, walletType, username, bio, daos, profileImage } = req.body;
    console.log(req.body);
    return;
    const user = await UserModel.create({
      [walletType + "Address"]: publicKey,
      username,
      bio,
      daos,
      profileImage
    });

    return successResponse({ res, response: { data: "success" } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
