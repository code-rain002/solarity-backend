import { successResponse, errorResponse, throwError } from "../../../utils";
import UserModel from "../../User/model";
import _ from "lodash";

export const checkUsernameAvailabilityController = async (req, res) => {
  try {
    const {
      params: { username },
      session: { userId },
    } = req;
    // check if username is valid
    const exists = await UserModel.findOne(
      { username },
      { username: 1, userId: 1 }
    );
    if (exists && exists.id !== userId) {
      throwError("Username is in use");
    }
    return successResponse({ res, response: { available: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
