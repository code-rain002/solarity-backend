import md5 from "md5";
import _ from "lodash";

import {
  getParsedNftAccountsByOwner,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";

import UserModel from "../User/model";
import { getProfileData } from "../Profile/helpers";
import { validatePassword } from "../../helpers/authHelpers";
import {
  errorResponse,
  successResponse,
  throwError,
  verifySignature,
} from "../../helpers";

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
    const nonce = String(Math.ceil(Math.random() * 99999) + 10000);

    const user = await UserModel.findOne(
      { publicAddress },
      { publicAddress: 1, nonce: 1 }
    );

    if (!user) throwError("No user with the provided public address exists");

    if (requestNonce) {
      await UserModel.updateOne({ _id: user.id }, { nonce });
      return successResponse({ res, response: { nonce } });
    }

    const verified = verifySignature(user.nonce, signature, publicAddress);
    if (!verified) throwError("Invalid signature, unable to login");

    await UserModel.updateOne({ _id: user.id }, { nonce });

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
export const logoutUserController = async (req, res, next) => {
  await req.session.destroy();
  return successResponse({ res });
};

// OK
export const checkLoginController = async (req, res) => {
  return successResponse({ res });
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
