import {
  successResponse,
  errorResponse,
  throwError,
  getProfileData,
} from "../../../utils";

export const getProfileController = async (req, res) => {
  try {
    const { userId } = req.session;
    const profile = await getProfileData(userId);
    if (!profile) {
      await res.session.destroy();
      throwError("Please login again");
    }
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
