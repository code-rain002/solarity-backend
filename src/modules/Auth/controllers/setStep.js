import { successResponse, errorResponse, getProfileData } from "../../../utils";
import UserModel from "../../User/model";

export const setStepController = async (req, res) => {
  try {
    const { stepNum, data } = req.body;
    const profile = await req.profile();

    const user = await UserModel.findOne({ solanaAddress: profile.solanaAddress });
    for(let field in data) {
      if (field == "username" && data[field] == null) {
        user[field] = undefined;
      } else {
        user[field] = data[field];
      }
    }
    user.registerStep = stepNum;
    await user.save();
    return successResponse({ res, response: { success: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
