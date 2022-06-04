import {
  successResponse,
  errorResponse,
  throwError,
  removeWhiteSpaces,
  isProfileVisible,
  usernameValidator,
} from "../../../utils";
import UserModel from "../../User/model";

const formatForId = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase().replace(/\s+/g, "");
  }
  return undefined;
};

export const updateProfileInfoController = async (req, res, next) => {
  try {
    const {
      session: { userId },
      body: { action, username, bio },
    } = req;

    if (action !== undefined && action !== "info") return next();
    const { available, reason } = await usernameValidator(username, userId);
    if (!available) throwError(reason);
    const updateObject = {
      username: formatForId(username),
      bio: removeWhiteSpaces(bio),
    };
    let userData = await req.profile();
    userData.stepsCompleted.infoAdded = true;
    const visible = isProfileVisible(userData);
    userData.visible = visible;
    userData = { ...userData, ...updateObject };
    await UserModel.updateOne(
      { _id: userId },
      { ...updateObject, "stepsCompleted.infoAdded": true, visible }
    );

    return successResponse({ res, response: { profile: userData } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

const validatUsername = (username) => {
  if (!username.match(/^[a-zA-Z][a-zA-Z0-9]*$/gm) || username.length < 3) {
    throwError("Invalid username");
  }
};
