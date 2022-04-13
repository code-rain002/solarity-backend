import axios from "axios";
import {
  successResponse,
  errorResponse,
  throwError,
  revokeDiscord,
} from "../../../helpers";
import UserModel from "../../User/model";

export const unlinkAccountController = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    const { link } = req.body;
    switch (link) {
      case "discord":
        await unlinkDiscord(user);
        break;
      case "twitter":
        throwError("Twitter connection not yet available");
        break;
    }
    let profile = await req.profile();
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

const unlinkDiscord = async (user) => {
  const { accessToken } = user.externalLinks.discord;
  await revokeDiscord(accessToken);
  await UserModel.updateOne(
    { _id: user._id },
    {
      "externalLinks.discord": {
        connected: false,
      },
    }
  );
};
