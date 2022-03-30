import { successResponse, errorResponse, throwError } from "../../../helpers";
import UserModel from "../../User/model";
import { removeWhiteSpaces } from "../../../utils";

const formatForId = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase().replace(/\s+/g, "");
  }
  return undefined;
};

export const updateProfileController = async (req, res) => {
  try {
    const {
      session: { userId },
      body,
    } = req;

    validateProfileData(body);

    const user = await UserModel.findById(userId);

    const newVal = (key) => body[key] || user[key] || "";

    const updateObject = {};
    // FORMAT USERNAME
    updateObject.username = formatForId(newVal("username"));
    // FORMAT BIO
    updateObject.bio = removeWhiteSpaces(newVal("bio"));
    // GENERATE EXTERNAL LINKS
    injectExternalLinks(updateObject, body, user);

    // REMOVE EMPTY
    Object.keys(updateObject).forEach((key) => {
      if (updateObject[key] === user[key] || !updateObject[key])
        delete updateObject[key];
    });

    await UserModel.updateOne(
      { _id: userId },
      { ...updateObject, "stepsCompleted.infoAdded": true }
    );
    const userData = await req.profile();

    return successResponse({ res, response: { profile: userData } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

const validateProfileData = (body) => {
  const { username } = body;
  if (!username.match(/^[a-zA-Z][a-zA-Z0-9]*$/gm) || username.length < 3) {
    throwError("Invalid username");
  }
};

const injectExternalLinks = (updateObject, body, user) => {
  const { twitterUsername, githubUsername, discordHandle } = body;
  if (twitterUsername) {
    updateObject["externalLinks.twitter.username"] = twitterUsername;
  }
  if (githubUsername) {
    updateObject["externalLinks.github.username"] = githubUsername;
  }
  if (discordHandle) {
    updateObject["externalLinks.discord.handle"] = discordHandle;
  }
};
