import UserModel from "../../User/model";
import DaoModel from "../model";
import { Types } from "mongoose";
import { errorResponse, successResponse, throwError } from "../../../helpers";

// OK
export const unfollowDaoController = async (req, res) => {
  try {
    const {
      params: { symbol },
      session: { userId },
    } = req;

    const daoToUnfollow = await DaoModel.findOne({ symbol }, { symbol: 1 });
    if (!daoToUnfollow) throwError("User doesn't exist");
    const idObject = new Types.ObjectId(daoToUnfollow._id);

    const x = await UserModel.findById(userId, {
      alreadyFollowing: {
        $in: [idObject, "$following.daos"],
      },
    });
    if (!x.get("alreadyFollowing")) {
      throwError("You are not following the DAO");
    }

    await DaoModel.updateOne(
      { symbol },
      {
        $inc: { followerCount: -1 },
      }
    );
    await UserModel.updateOne(
      { _id: userId },
      {
        $pull: { "following.daos": daoToUnfollow.id },
      }
    );
    return successResponse({ res });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};
