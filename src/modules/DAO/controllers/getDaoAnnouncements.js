import UserModel from "../../User/model";
import DaoModel from "../model";
import {
  errorResponse,
  getDiscordChannelMessages,
  getDiscordGuilds,
  successResponse,
  throwError,
} from "../../../utils";

export const getDaoAnnouncementsController = async (req, res) => {
  try {
    const {
      params: { symbol },
      session: { userId },
    } = req;
    const { discord } = await DaoModel.findOne({ symbol }, { discord: 1 });
    if (!discord || !discord.guildId || !discord.channelId) {
      throwError("The DAO has not provided the discord info");
    }
    const { channelId, guildId } = discord;
    const {
      externalLinks: {
        discord: { connected, accessToken, refreshToken },
      },
    } = await UserModel.findById(userId);
    if (!connected) throwError("Your discord is not connected");
    // const newToken = await refreshDiscordToken(refreshToken, userId);
    // console.log(newToken);

    const data = await getDiscordGuilds(accessToken);
    const isMember = data.find(({ id }) => id === guildId);
    if (!isMember) {
      throwError("You cannot view the announcements of this DAO");
    }
    const messages = await getDiscordChannelMessages(channelId, accessToken);
    console.log(messages);
    return successResponse({ res });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};
