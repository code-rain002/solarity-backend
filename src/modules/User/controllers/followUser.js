import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../model";
import { Types } from "mongoose";

export const followUserController = async (req, res) => {
  try {
    const {
      params: { username },
      session: { userId },
    } = req;

    const userToFollow = await UserModel.findOne({ username }, { username: 1 });
    if (!userToFollow) throwError("User doesn't exist");
    if (userToFollow.id === userId) throwError("You cannot follow yourself");
    const idObject = new Types.ObjectId(userToFollow._id);

    const x = await UserModel.findById(userId, {
      alreadyFollowing: {
        $in: [idObject, "$following.users"],
      },
    });
    if (x.get("alreadyFollowing")) {
      throwError("You are already following the user");
    }

    await UserModel.updateOne(
      { username },
      {
        $inc: { followerCount: 1 },
      }
    );
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: { "following.users": userToFollow.id },
      }
    );

    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
