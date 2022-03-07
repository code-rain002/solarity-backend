import md5 from "md5";
import { errorResponse, successResponse, throwError } from "../../helpers";

import UserModel from "../User/model";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) throwError("Account with the provided email already exists");

    req.body.password = md5(password);
    await UserModel.create(req.body);

    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    password = md5(password);
    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) throwError("invalid credentials");
    req.session.userId = user.id;
    req.session.email = email;
    req.session.logged = true;
    await req.session.save();
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err, location: "loginUser" });
  }
};

export const logoutUser = async (req, res, next) => {
  await req.session.destroy();
  return successResponse({ res });
};

export const checkLogin = async (req, res) => {
  return successResponse({ res });
};
