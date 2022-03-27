import {
  successResponse,
  errorResponse,
  throwError,
  verifySignature,
} from "../../helpers";
import UserModel from "../User/model";
import md5 from "md5";
import _ from "lodash";
import { Promise } from "bluebird";
import { validatePassword } from "../../helpers/authHelpers";
import {
  getParsedAccountByMint,
  isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { checkIfOwnsNft } from "../../helpers/nftHelpers";
import { isProfileVisible } from "./helpers";

// OK
export const getProfileController = async (req, res) => {
  try {
    const profile = await req.profile();
    if (!profile) {
      await res.session.destroy();
      throwError("Please login again");
    }
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
export const updateProfileController = async (req, res) => {
  try {
    const {
      session: { userId },
      body,
    } = req;

    const user = await UserModel.findById(userId);
    const updateObject = {};
    const checkIfExists = async (key) => {
      if (!updateObject[key] || updateObject[key] === user[key]) return false;
      const existing = await UserModel.findOne({
        [key]: body[key].toLowerCase(),
      });
      if (existing)
        throwError(`User with the provided '${key}' already exists`);
      return false;
    };
    const newVal = (key) => body[key] || user[key] || "";
    const formatForId = (value) => {
      if (typeof value === "string") {
        return value.toLowerCase().replace(/\s+/g, "");
      }
      return undefined;
    };
    // FORMAT FULLNAME
    updateObject.fullName = newVal("fullName");
    if (updateObject.fullName) {
      updateObject.fullName = updateObject.fullName
        .replace(/  +/g, " ")
        .split(" ")
        .map((val) => _.capitalize(val))
        .join(" ");
    }

    // FORMAT USERNAME
    updateObject.username = formatForId(newVal("username"));
    // FORMAT BIO
    updateObject.bio = newVal("bio");
    if (updateObject.bio) {
      updateObject.bio = updateObject.bio.replace(/  +/g, " ");
    }

    // FORMAT EMAIL
    updateObject.email = formatForId(newVal("email"));
    // FORMAT GITHUBUSERNAME
    updateObject.githubUsername = formatForId(newVal("githubUsername"));

    // FORMAT DISCORDHANDLE
    updateObject.discordHandle = formatForId(newVal("discordHandle"));

    // FORMAT TWITTERUSERNAME
    updateObject.twitterUsername = formatForId(newVal("twitterUsername"));

    // REMOVE EMPTY
    Object.keys(updateObject).forEach((key) => {
      if (updateObject[key] === user[key] || !updateObject[key])
        delete updateObject[key];
    });

    // TWITTER USERNAME OWNERSHIP VALIDATION
    if (
      updateObject.twitterUsername &&
      updateObject.twitterUsername !== user.twitterUsername
    ) {
      // const twitterInfo = await validateTwitterUsername(
      //   req,
      //   updateObject.twitterUsername
      // );
      // const {
      //   data: { id: twitterId },
      // } = twitterInfo;
      updateObject.twitterId = undefined;
    }

    // check if any of the unique data is in use
    const valueChecks = [
      "username",
      "email",
      "githubUsername",
      "discordHandle",
      "twitterUsername",
    ];
    await Promise.each(valueChecks, async (value) => {
      await checkIfExists(value);
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

export const claimDaosController = async (req, res) => {
  try {
    const {
      session: { userId },
    } = req;
    let profile = await req.profile();
    // steps of claiming will come here, when ready
    const ownsNft = await checkIfOwnsNft(profile.publicAddress);

    const updateObject = {
      stepsCompleted: {
        ...profile.stepsCompleted,
        daoClaimed: true,
        profilePicUpdated: ownsNft
          ? profile.stepsCompleted.profilePicUpdated || false
          : true,
      },
    };
    const visible = isProfileVisible(updateObject);
    profile = { ...profile._doc, ...updateObject, visible };
    await UserModel.updateOne({ _id: userId }, { ...updateObject, visible });
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
export const updatePublicAddressController = async (req, res) => {
  try {
    const {
      session: { userId },
      body: { publicAddress, signedUserId },
    } = req;

    // Validate if the public address is valid
    if (!isValidSolanaAddress(publicAddress)) {
      throw false;
    }

    // verify the signature
    const verified = verifySignature(userId, signedUserId, publicAddress);
    if (!verified) throwError("Invalid signature");

    await UserModel.updateOne({ _id: userId }, { publicAddress });
    return successResponse({ res });
  } catch (err) {
    return errorResponse({
      res,
      err,
      message: "Unable to verify the public address",
    });
  }
};

export const updateProfilePicController = async (req, res) => {
  try {
    const {
      body: { mint },
      session: { userId },
    } = req;
    // check if the user is the owner of the nft
    // const {
    //   account: { owner: nftOwnerAddress },
    // } = await getParsedAccountByMint({
    //   mintAddress: mint,
    //   connection: req.solanaConnection,
    // });
    const profile = await req.profile();

    // if (profile.publicAddress !== nftOwnerAddress) {
    //   throwError("The NFT is not owned by you");
    // }

    const { data: nftDetails } = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/tokens/${mint}`
    );

    const profileImageUpdates = {
      link: nftDetails.image,
      address: mint,
    };
    profile.profileImage = profileImageUpdates;
    profile.stepsCompleted.profilePicUpdated = true;
    const visible = isProfileVisible(profile);
    profile.visible = visible;

    await UserModel.updateOne(
      { _id: userId },
      {
        profileImage: profileImageUpdates,
        stepsCompleted: profile.stepsCompleted,
        visible,
      }
    );

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
