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

// ok
export const registerUserController = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // DATA FORMATTING
    req.body.email = email.toLowerCase();
    req.body.username = username.toLowerCase().replace(/\s+/g, "");

    const existingUser = await UserModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (existingUser) throwError("The email or username is already in use");

    req.body.fullName = fullName
      .replace(/  +/g, " ")
      .split(" ")
      .map((val) => _.capitalize(val))
      .join(" ");

    // validate password
    const [error, errorMessage] = validatePassword(req.body.password);
    if (error) throwError(errorMessage);
    req.body.password = md5(password);

    await UserModel.create(req.body);

    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
export const registerUserWithPublicAddressController = async (req, res) => {
  try {
    const { requestNonce, publicAddress, signature } = req.body;
    if (!isValidSolanaAddress(publicAddress)) {
      throwError("Invalid public address");
    }
    const nonce = String(Math.ceil(Math.random() * 99999) + 10000);
    const cache = req.app.get("registerNonceCache");
    if (requestNonce) {
      cache.set(publicAddress, nonce);
      return successResponse({ res, response: { nonce } });
    }

    const savedNonce = cache.get(publicAddress);
    if (!savedNonce) {
      throwError("Please request a nonce first");
    }

    const verified = verifySignature(savedNonce, signature, publicAddress);

    if (!verified) throwError("Invalid signature, unable to register");

    const user = await UserModel.create({
      publicAddress,
    });

    await req.session.save();

    const profile = await getProfileData(user.id);

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({
      res,
      err,
      location: "LoginUserWithPublicAddressController",
    });
  }
};

// OK
export const loginUserController = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.toLowerCase();
    password = md5(password);

    const user = await UserModel.findOne(
      {
        $or: [{ username }, { email: username }],
      },
      {
        password: 1,
      }
    );

    if (!user || user.password !== password) throwError("invalid credentials");

    req.session.userId = user.id;
    req.session.logged = true;
    await req.session.save();

    const profile = await getProfileData(user.id);

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err, location: "loginUser" });
  }
};

// OK
export const LoginUserWithPublicAddressController = async (req, res) => {
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
        profileCompleted: false,
      });
      userId = user.id;
    } else {
      await UserModel.updateOne({ _id: user.id }, { nonce });
      userId = user.id;
    }

    req.session.userId = userId;
    req.session.logged = true;
    await req.session.save();

    const profile = await getProfileData(userId);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({
      res,
      err,
      location: "LoginUserWithPublicAddressController",
    });
  }
};

// OK
export const logoutUserController = async (req, res, next) => {
  await req.session.destroy();
  return successResponse({ res });
};

// OK
export const checkLoginController = async (req, res) => {
  try {
    const { userId } = req.session;
    const profile = await getProfileData(userId);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};

export const test = async (req, res) => {
  try {
    // const connection = new web3.Connection(
    //   "https://api.mainnet-beta.solana.com",
    //   "confirmed"
    // );

    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
