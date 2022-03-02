import { errorResponse, throwError } from "../helpers";

export const authenticate = async (req, res, next) => {
  try {
    const session = req.session;
    if (!session || !session.logged)
      throwError("Session has expired, please login");
    return next();
  } catch (err) {
    return errorResponse({ res, err });
  }
};
