import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import {
  successResponse,
  errorResponse,
  throwError,
  revokeDiscord,
  twitterAuthorizationToken,
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
        throwError("Unavailable");
        break;
      case "ethereum":
        await unlinkEthereum(user);
        break;
      case "solana":
        await unlinkSolana(user);
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

const unlinkTwitter = async (user) => {
  const { accessToken } = user.externalLinks.twitter;
  try {
    let params = {
      access_token: accessToken,
    };
    console.log(accessToken);
    const paramString = new URLSearchParams(params);
    const { response } = await axios.post(
      "https://api.twitter.com/2/oauth2/invalidate_token",
      paramString,
      {
        Authorization: twitterAuthorizationToken,
      }
    );
    console.log(response);
  } catch (err) {
    console.log(err.response.data);
  }
  // await UserModel.updateOne(
  //   { _id: user._id },
  //   {
  //     "externalLinks.twitter": {
  //       connected: false,
  //     },
  //   }
  // );
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
