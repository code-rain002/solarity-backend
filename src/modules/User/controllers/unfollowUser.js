import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../model";
import { Types } from "mongoose";

export const unfollowUserController = async (req, res) => {
  try {
    const {
      params: { username },
      session: { userId },
    } = req;

    const userToUnfollow = await UserModel.findOne(
      { username },
      { username: 1 }
    );
    if (!userToUnfollow) throwError("User doesn't exist");

    if (userToUnfollow.id === userId) {
      throwError("You cannot unfollow yourself");
    }

    const idObject = new Types.ObjectId(userToUnfollow._id);

    const x = await UserModel.findById(userId, {
      alreadyFollowing: {
        $in: [idObject, "$following.users"],
      },
    });
    if (!x.get("alreadyFollowing")) {
      throwError("You are not following the user");
    }
    await UserModel.updateOne(
      { username },
      {
        $inc: { followerCount: -1 },
      }
    );
    await UserModel.updateOne(
      { _id: userId },
      {
        $pull: { "following.users": userToUnfollow.id },
      }
    );
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
