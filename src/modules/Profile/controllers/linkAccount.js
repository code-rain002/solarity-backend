import {
  successResponse,
  errorResponse,
  getDiscordUser,
  getTwitterAccessToken,
  getDiscordAccessToken,
  throwError,
} from "../../../helpers";
import UserModel from "../../User/model";
import { TwitterApi } from "twitter-api-v2";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

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
  const messageBufferHex = bufferToHex(Buffer.from(userId, "utf8"));
  const retrievedAddress = recoverPersonalSignature({
    data: messageBufferHex,
    sig: signature,
  });
  if (retrievedAddress !== walletAddress) {
    throwError("Invalid address/signature combo provided");
  }
  await UserModel.updateOne(
    { _id: userId },
    {
      "ethereum.walletAddress": walletAddress,
      "ethereum.connected": true,
    }
  );
};
