import md5 from "md5";
import _ from "lodash";

import UserModel from "../User/model";
import { getProfileData } from "../Profile/helpers";
import { validatePassword } from "../../helpers/authHelpers";
import {
  errorResponse,
  successResponse,
  throwError,
  verifySignature,
} from "../../helpers";
import { isValidSolanaAddress } from "@nfteyez/sol-rayz";
import { saveOwnedNfts } from "../../helpers/nftHelpers";
import { isValidAddress } from "ethereumjs-util";

// CHECKED
export const loginUserController = async (req, res) => {
  try {
    const { requestNonce, publicKey, walletType, signature } = req.body;
    const cache = req.app.get("registerNonceCache");

    let registerFlag = false;
    // check if the address is a valid solana address
    if (
      (!isValidSolanaAddress(publicKey) && walletType === "solana") ||
      (!isValidAddress(publicKey) && walletType === "ethereum")
    ) {
      throwError("Invalid public key");
    }

    // generate nonce regardless
    const nonce = String(Math.ceil(Math.random() * 99999) + 10000);
    const user = await UserModel.aggregate([
      {
        $match: {
          $or: [{ solanaAddress: publicKey }, { ethereumAddress: publicKey }],
        },
      },
    ]);
    if (user.length === 0) registerFlag = true;

    if (requestNonce) {
      if (registerFlag) {
        cache.set(publicKey, nonce);
      } else {
        await UserModel.updateOne({ _id: user[0]._id }, { nonce });
      }
      return successResponse({ res, response: { nonce } });
    }

    let nonceToVerify;
    if (registerFlag) {
      nonceToVerify = cache.get(publicKey);
    } else {
      nonceToVerify = user[0].nonce;
    }

    const verified = verifySignature(
      nonceToVerify,
      signature,
      publicKey,
      walletType
    );
    if (!verified) throwError("Invalid signature, unable to login");

    let userId;
    if (registerFlag) {
      const user = await UserModel.create({
        [walletType + "Address"]: publicKey,
        stepsCompleted: {
          infoAdded: false,
          daoClaimed: false,
        },
      });
      userId = user._id;
    } else {
      await UserModel.updateOne({ _id: user.id }, { nonce });
      userId = user[0]._id;
    }
    req.session.userId = userId.toString();
    req.session.logged = true;
    await req.session.save();

    if (registerFlag) {
      await saveOwnedNfts(publicAddress);
    }

    const profile = await getProfileData(req);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({
      res,
      err,
      location: "loginUserController",
    });
  }
};

// CHECKED
export const logoutUserController = async (req, res, next) => {
  await req.session.destroy();
  return successResponse({ res });
};

// CHECKED
export const checkLoginController = async (req, res) => {
  try {
    const { userId } = req.session;
    const profile = await getProfileData(req);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
