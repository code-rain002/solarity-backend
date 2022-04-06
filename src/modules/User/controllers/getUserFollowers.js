import { errorResponse, successResponse, throwError } from "../../../helpers";
import UserModel from "../model";

export const getUserFollowersController = async (req, res) => {
  try {
    const {
      params: { username },
    } = req;
    const followedUser = await UserModel.findOne({ username }, { username: 1 });
    if (!followedUser) throwError("User doesn't exist");
    const followers = await UserModel.aggregate([
      {
        $addFields: {
          profileImageLink: "$profileImage.link",
        },
      },
      {
        $set: {
          isFollowing: {
            $in: [followedUser._id, "$following.users"],
          },
        },
      },
      {
        $project: { isFollowing: 1, profileImageLink: 1, username: 1 },
      },
      {
        $match: { isFollowing: true },
      },
    ]);
    return successResponse({ res, response: { followers } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
