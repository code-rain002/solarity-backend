import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../model";
import { Types } from "mongoose";

export const getFollowingStatusController = async (req, res) => {
  try {
    const {
      params: { username },
      session: { userId },
    } = req;
    let following = false;
    const user = await UserModel.findOne({ username }, { id: 1 });
    const result = await UserModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $set: {
          following: {
            $in: [new Types.ObjectId(user._id), "$following.users"],
          },
        },
      },
      {
        $project: { following: 1 },
      },
    ]);
    if (result && result.length > 0) {
      following = result[0].following;
    }
    return successResponse({ res, response: { following } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
