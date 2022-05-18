import _ from "lodash";
import UserModel from "../../User/model";

import {
  errorResponse,
  successResponse,
  throwError,
  verifySignature,
} from "../../../utils";

import { isValidSolanaAddress } from "@nfteyez/sol-rayz";
import { isValidAddress } from "ethereumjs-util";

export const loginUserController = async (req, res, next) => {
  try {
    const { requestNonce, publicKey, walletType, signature } = req.body;
    const cache = req.app.get("registerNonceCache");
    let registerFlag = false;
    // check if the address is a valid solana address
    if (
      (!isValidSolanaAddress(publicKey) && walletType === "solana") ||
      (!isValidAddress(publicKey) && walletType === "ethereum")
    ) {
      throwError(`Invalid ${walletType} wallet address provided`);
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

    // if no matching user == a user is trying to register
    if (user.length === 0) registerFlag = true;

    // in case the user is requesting a nonce
    if (requestNonce) {
      if (registerFlag) {
        cache.set(publicKey, nonce);
      } else {
        await UserModel.updateOne({ _id: user[0]._id }, { nonce });
      }
      return successResponse({ res, response: { nonce } });
    }

    let nonceToVerify;
    // fetch the nonce depending if the user is logging or registering
    if (registerFlag) {
      nonceToVerify = cache.get(publicKey);
    } else {
      nonceToVerify = user[0].nonce;
    }

    // verify the nonce
    const verified = verifySignature(
      nonceToVerify,
      signature,
      publicKey,
      walletType
    );

    // throw an error, if the signature is invalid
    if (!verified) throwError("Invalid signature, unable to login");

    let userId;

    // register in case the user is logging in for the first time
    if (registerFlag) {
      const user = await UserModel.create({
        [walletType + "Address"]: publicKey,
        stepsCompleted: {
          infoAdded: false,
          daoClaimed: false,
          profilePicUpdated: false,
        },
      });
      // set the id to the new user
      userId = user._id;
    } else {
      // if the user exists, then just update the nonce and set the id
      await UserModel.updateOne({ _id: user.id }, { nonce });
      userId = user[0]._id;
    }

    // set the session user ID
    req.session.userId = userId.toString();
    req.session.logged = true;
    await req.session.save();
    return next();
  } catch (err) {
    return errorResponse({
      res,
      err,
      location: "loginUserController",
    });
  }
};
