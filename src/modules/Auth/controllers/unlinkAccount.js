import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import {
  successResponse,
  errorResponse,
  throwError,
  revokeDiscord,
  revokeGithub,
  twitterAuthorizationToken,
} from "../../../utils";
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
        unlinkTwitter(user);
        break;
      case "github":
        await unlinkGithub(user);
        break;
      case "ethereum":
        await unlinkEthereum(user);
        break;
      case "solana":
        await unlinkSolana(user);
        break;
    }
    // let profile = await req.profile();
    let profile = await UserModel.findOne({ _id: userId });
    return successResponse({ res, response: { type: link } });
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

const unlinkTwitter = async (user) => {
  const { accessToken } = user.externalLinks.twitter;
  try {
    let params = {
      token: accessToken,
      client_id: process.env.TWITTER_API_KEY
    };
    const paramString = new URLSearchParams(params);
    const { response } = await axios.post(
      "https://api.twitter.com/2/oauth2/revoke",
      paramString,
      {
        "Authorization": twitterAuthorizationToken,
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );
    console.log(response);
  } catch (err) {
    console.log(err.response.data);
  }
  await UserModel.updateOne(
    { _id: user._id },
    {
      "externalLinks.twitter": {
        connected: false,
      },
    }
  );
};

const unlinkGithub = async (user) => {
  const { accessToken } = user.externalLinks.github;
  await revokeGithub(accessToken);
  await UserModel.updateOne(
    { _id: user._id },
    {
      "externalLinks.github": {
        connected: false,
      },
    }
  );
};

const unlinkEthereum = async (user) => {
  if (!user.solanaAddress) {
    throwError("At least one wallet must be linked");
  }
  await UserModel.updateOne(
    { _id: user._id },
    {
      ethereumAddress: null,
    }
  );
};

const unlinkSolana = async (user) => {
  if (!user.ethereumAddress) {
    throwError("At least one wallet must be linked");
  }
  await UserModel.updateOne(
    { _id: user._id },
    {
      solanaAddress: null,
    }
  );
};
