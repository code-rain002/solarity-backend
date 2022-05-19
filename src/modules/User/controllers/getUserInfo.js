import { successResponse, errorResponse } from "../../../utils";
import UserModel from "../model";

export const getUserInfoController = async (req, res) => {
  try {
    const {
      params: { name: name },
    } = req;

    const user = await UserModel.findOne({ username: name });
    if (!user) {
      return errorResponse({ res, err: "User doesn't exist" });
    }
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
