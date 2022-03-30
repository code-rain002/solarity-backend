import { successResponse, errorResponse, throwError } from "../../../helpers";

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
