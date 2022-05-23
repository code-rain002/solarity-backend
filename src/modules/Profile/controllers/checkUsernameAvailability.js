import {
  successResponse,
  errorResponse,
  throwError,
  usernameValidator,
} from "../../../utils";
import _ from "lodash";

export const checkUsernameAvailabilityController = async (req, res) => {
  try {
    const {
      params: { username },
      session: { userId },
    } = req;
    const { available, reason } = await usernameValidator(username, userId);
    if (!available) throwError(reason);
    return successResponse({ res, response: { available: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
