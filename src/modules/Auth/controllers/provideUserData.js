import { successResponse, errorResponse, getProfileData } from "../../../utils";

export const provideUserDataController = async (req, res) => {
  try {
    const { userId } = req.session;
    const profile = await getProfileData(userId);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
