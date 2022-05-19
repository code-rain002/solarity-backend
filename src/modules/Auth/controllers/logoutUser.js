import { successResponse, errorResponse } from "../../../utils";

export const logoutUserController = async (req, res) => {
  try {
    await req.session.destroy();
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
