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

// CHECKED
export const loginUserController = async (req, res) => {
  try {
    const { requestNonce, publicAddress, signature } = req.body;
    const cache = req.app.get("registerNonceCache");

    let registerFlag = false;
    // check if the address is a valid solana address
    if (!isValidSolanaAddress(publicAddress)) {
      throwError("Invalid public address");
    }

    // generate nonce regardless
    const nonce = String(Math.ceil(Math.random() * 99999) + 10000);

    const user = await UserModel.findOne(
      { publicAddress },
      { publicAddress: 1, nonce: 1 }
    );

    if (!user) registerFlag = true;

    if (requestNonce) {
      if (registerFlag) {
        cache.set(publicAddress, nonce);
      } else {
        await UserModel.updateOne({ _id: user.id }, { nonce });
      }
      return successResponse({ res, response: { nonce } });
    }

    let nonceToVerify;
    if (registerFlag) {
      nonceToVerify = cache.get(publicAddress);
    } else {
      nonceToVerify = user.nonce;
    }

    const verified = verifySignature(nonceToVerify, signature, publicAddress);

    if (!verified) throwError("Invalid signature, unable to login");

    let userId;
    if (registerFlag) {
      const user = await UserModel.create({
        publicAddress,
        stepsCompleted: {
          infoAdded: false,
          daoClaimed: false,
        },
      });
      userId = user.id;
    } else {
      await UserModel.updateOne({ _id: user.id }, { nonce });
      userId = user.id;
    }

    req.session.userId = userId;
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
