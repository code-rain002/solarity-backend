import {
  successResponse,
  errorResponse,
  getDiscordUser,
  getTwitterAccessToken,
  getDiscordAccessToken,
  throwError,
  verifySignature,
  getGithubAccessToken,
  getGithubUser
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
      case "github":
        await linkGithub(String(_id), code, url);
        break;
      case "ethereum":
        await linkEthereum(String(_id), signature, walletAddress);
        break;
      case "solana":
        await linkSolana(String(_id), signature, walletAddress);
        break;
    }
    // profile = await req.profile();
    profile = await UserModel.findOne({ _id: _id });
    return successResponse({ res, response: { type: link, link: profile.externalLinks[link] } });
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
  const {
    data: { username, id },
  } = await client.v2.me();
  await UserModel.updateOne(
    { _id: userId },
    {
      "externalLinks.twitter.connected": true,
      "externalLinks.twitter.username": username,
      "externalLinks.twitter.id": id,
    }
  );
};

const linkGithub = async (userId, code, url) => {
  const accessToken = await getGithubAccessToken(userId, code, url);
  const user = await getGithubUser(accessToken);
  await UserModel.updateOne(
    { _id: userId },
    {
      "externalLinks.github.username": user.login,
      "externalLinks.github.connected": true,
    }
  );
};

const linkEthereum = async (userId, signature, walletAddress) => {
  if (!verifySignature(userId, signature, walletAddress, "ethereum")) {
    throwError("Invalid address/signature combo provided");
  }
  await entryExists(
    userId,
    "ethereumAddress",
    walletAddress,
    "Ethereum address"
  );
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
  await entryExists(userId, "solanaAddress", walletAddress, "Solana address");
  await UserModel.updateOne(
    { _id: userId },
    {
      solanaAddress: walletAddress,
    }
  );
};

const entryExists = async (userId, key, value, linkName) => {
  const user = await UserModel.findOne({ [key]: value });
  if (user && user.id !== userId) {
    throwError(`Another user account is already linked to this ${linkName}`);
  }
};
