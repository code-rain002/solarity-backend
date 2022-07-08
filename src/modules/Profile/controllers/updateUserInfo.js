import {
  successResponse,
  errorResponse,
  throwError,
  removeWhiteSpaces,
  isProfileVisible,
  domainValidator,
} from "../../../utils";
import UserModel from "../../User/model";

const formatForId = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase().replace(/\s+/g, "");
  }
  return undefined;
};

export const updateUserInfoController = async (req, res, next) => {
  try {
    const {
      session: { userId },
      body: { action, domain, title },
    } = req;

    if (action !== undefined && action !== "info") return next();
    const { available, reason } = await domainValidator(domain, userId);
    if (!available) throwError(reason);
    const updateObject = {
      domain: formatForId(domain),
      title: removeWhiteSpaces(title),
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

const validatdomain = (domain) => {
  if (!domain.match(/^[a-zA-Z][a-zA-Z0-9]*$/gm) || domain.length < 3) {
    throwError("Invalid Domain");
  }
};
