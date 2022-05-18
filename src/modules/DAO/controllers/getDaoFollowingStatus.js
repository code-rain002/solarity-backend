import UserModel from "../../User/model";
import DaoModel from "../model";
import { Types } from "mongoose";
import { errorResponse, successResponse } from "../../../utils";

export const getDaoFollowingStatusController = async (req, res) => {
  try {
    const {
      params: { symbol },
      session: { userId },
    } = req;
    let following = false;
    const dao = await DaoModel.findOne({ symbol }, { id: 1 });
    const result = await UserModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $set: {
          following: {
            $in: [new Types.ObjectId(dao._id), "$following.daos"],
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
    console.log(err);
    return errorResponse({ res, err });
  }
};
