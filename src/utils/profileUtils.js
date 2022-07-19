import { throwError } from "./index";
import UserModel from "../modules/User/model";
import { Types } from "mongoose";

const VALIDATE_TWITTER = false;

export const validateTwitterUsername = async (req, username) => {
  const { userId } = req.session;
  const twitterApi = req.app.get("twitterApi");
  if (VALIDATE_TWITTER) {
    const timeline = await twitterApi.v1.userTimelineByUsername(username, {
      count: 5,
    });
    const { _realData } = timeline;
    const data = _realData.map(({ full_text }) => full_text.trim());
    if (!data.includes(userId)) {
      throwError("Unable to verify twitter account ownership");
    }
  }
  const twitterData = await twitterApi.v2.userByUsername(username);
  if (twitterData.errors) throwError("Invalid twitter username");
  return twitterData;
};

export const getProfileData = async (userId) => {
  const user = await UserModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(userId) },
    },
    {
      $addFields: {
        profileImageLink: "$profileImage.link",
        profileImageInfo: "$profileImage",
        twitterUsername: "$externalLinks.twitter.username",
        githubUsername: "$externalLinks.github.username",
        discordUsername: "$externalLinks.discord.username",
        discordConnected: "$externalLinks.discord.connected",
        twitterConnected: "$externalLinks.twitter.connected",
      },
    },
    {
      $unset: [
        "following",
        "createdAt",
        "updatedAt",
        "nonce",
        // "profileImage",
        "externalLinks",
      ],
    },
  ]);
  return user[0];
};

export const isProfileVisible = (profile) => {
  const {
    stepsCompleted: { infoAdded, daoClaimed, profilePicUpdated },
  } = profile;
  return infoAdded && daoClaimed && profilePicUpdated;
};
