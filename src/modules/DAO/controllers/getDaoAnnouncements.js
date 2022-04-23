import UserModel from "../../User/model";
import DaoModel from "../model";
import { Types } from "mongoose";
import {
  errorResponse,
  getDiscordChannel,
  getDiscordUser,
  refreshDiscordToken,
  successResponse,
  throwError,
} from "../../../helpers";

export const getDaoAnnouncementsController = async (req, res) => {
  try {
    const {
      params: { symbol },
      session: { userId },
    } = req;
    const {
      externalLinks: {
        discord: { connected, accessToken, refreshToken },
      },
    } = await UserModel.findById(userId);
    if (!connected) throwError("Your discord is not connected");
    // const newToken = await refreshDiscordToken(refreshToken, userId);
    // console.log(newToken);

    const data = await getDiscordChannel(accessToken);

    console.log(data);
    return successResponse({ res });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};
