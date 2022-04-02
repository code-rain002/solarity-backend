import UserModel from "../../User/model";
import DaoModel from "../model";
import { Types } from "mongoose";
import { errorResponse, successResponse, throwError } from "../../../helpers";

export const followDaoController = async (req, res) => {
  try {
    const {
      params: { symbol },
      session: { userId },
    } = req;
    const daoToFollow = await DaoModel.findOne({ symbol }, { symbol: 1 });
    if (!daoToFollow) throwError("User doesn't exist");
    const idObject = new Types.ObjectId(daoToFollow._id);
    const x = await UserModel.findById(userId, {
      alreadyFollowing: {
        $in: [idObject, "$following.daos"],
      },
    });
    if (x.get("alreadyFollowing")) {
      throwError("You are already following the DAO");
    }

    await DaoModel.updateOne(
      { symbol },
      {
        $inc: { followerCount: 1 },
      }
    );
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: { "following.daos": daoToFollow.id },
      }
    );

    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
