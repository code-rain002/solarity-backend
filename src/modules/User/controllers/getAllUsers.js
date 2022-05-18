import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";

export const getAllUsersController = async (req, res) => {
  try {
    const data = await UserModel.find();
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
