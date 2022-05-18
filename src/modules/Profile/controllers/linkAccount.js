import {
  successResponse,
  errorResponse,
  getDiscordUser,
  getTwitterAccessToken,
  getDiscordAccessToken,
  throwError,
  verifySignature,
} from "../../../utils";
import UserModel from "../../User/model";
import { TwitterApi } from "twitter-api-v2";

export const linkAccountController = async (req, res) => {
  try {
    let profile = await req.profile();
    const { _id } = profile;
    const { code, link, url, signature, walletAddress } = req.body;
    switch (link) {
      case "discord":
        await linkDiscord(String(_id), code, url);
        break;
      case "twitter":
        await linkTwitter(String(_id), code, url);
        break;
      case "ethereum":
        await linkEthereum(String(_id), signature, walletAddress);
        break;
      case "solana":
        await linkSolana(String(_id), signature, walletAddress);
        break;
    }
    profile = await req.profile();
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// link discord
const linkDiscord = async (userId, code, url) => {
  const accessToken = await getDiscordAccessToken(userId, code, url);
  const user = await getDiscordUser(accessToken);
  await UserModel.updateOne(
    { _id: userId },
    {
      "externalLinks.discord.username": user.username,
      "externalLinks.discord.connected": true,
    }
  );
};

const linkTwitter = async (userId, code, url) => {
  const accessToken = await getTwitterAccessToken(userId, code, url);
  const client = new TwitterApi(accessToken);
  console.log(code);
  const {
    data: { username },
  } = await client.v2.me();
  await UserModel.updateOne(
    { _id: userId },
    {
      "externalLinks.twitter.connected": true,
      "externalLinks.twitter.username": username,
    }
  );
};

const linkEthereum = async (userId, signature, walletAddress) => {
  if (!verifySignature(userId, signature, walletAddress, "ethereum")) {
    throwError("Invalid address/signature combo provided");
  }
  await UserModel.updateOne(
    { _id: userId },
    {
      ethereumAddress: walletAddress,
    }
  );
};

const linkSolana = async (userId, signature, walletAddress) => {
  if (!verifySignature(userId, signature, walletAddress, "solana")) {
    throwError("Invalid address/signature combo provided");
  }
  await UserModel.updateOne(
    { _id: userId },
    {
      solanaAddress: walletAddress,
    }
  );
};
