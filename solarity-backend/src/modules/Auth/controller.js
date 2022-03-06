import md5 from "md5";
import { errorResponse, successResponse, throwError } from "../../helpers";

import UserModel from "../User/model";

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
