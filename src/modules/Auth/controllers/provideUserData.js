import { successResponse, errorResponse, getProfileData } from "../../../utils";
import UserModel from "../../User/model";

export const provideUserDataController = async (req, res) => {
  try {
    const { userId } = req.session;
    let profile = await getProfileData(userId);
    if(!!profile) {
      const { visible, stepsCompleted } = profile;
      if (!visible) {
        const values = Object.values(stepsCompleted);
        if (!values.includes(false)) {
          await UserModel.updateOne({ _id: userId }, { visible: true });
          profile = await getProfileData(userId);
        }
      }
    } else {
      profile = {};
    }
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
