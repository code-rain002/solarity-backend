import { errorResponse, successResponse, throwError } from "../../helpers";
import UserModel from "./model";
import { Types } from "mongoose";

const userDataFormat = {
  password: 0,
  followers: 0,
  following: 0,
  email: 0,
  createdAt: 0,
  updatedAt: 0,
};

// OK
export const getUsersController = async (req, res) => {
  try {
    const {
      session: { userId },
      query: { page = 1, count = 10, term = "" },
    } = req;
    let searchTerm = new RegExp(term.toLowerCase(), "i");
    const findOptions = {
      $nor: [{ _id: userId }],
      $or: [
        { username: searchTerm },
        { email: searchTerm },
        { fullName: searchTerm },
      ],
    };
    const totalCount = await UserModel.count(findOptions);
    const totalPages = Math.ceil(totalCount / count);
    const data = await UserModel.find(findOptions, userDataFormat)
      .skip((page - 1) * count)
      .limit(count);
    return successResponse({ res, response: { data, totalPages, totalCount } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
export const getUserController = async (req, res) => {
  try {
    const {
      params: { username: _username },
      session: { userId },
    } = req;
    const username = _username.toLowerCase();
    const selfObjectId = new Types.ObjectId(userId);
    const user = await UserModel.aggregate([
      {
        $match: {
          $or: [{ username }],
        },
      },
      {
        $addFields: {
          followerCount: { $size: "$followers" },
          followed: { $in: [selfObjectId, "$followers"] },
          self: { $eq: [selfObjectId, "$_id"] },
        },
      },
      { $unset: Object.keys(userDataFormat) },
    ]);
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
// WHAT if the user objects doesn't exist
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
        $push: { followers: userId },
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

// OK
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
    if (userToUnfollow.id === userId)
      throwError("You cannot unfollow yourself");

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
        $pull: { followers: userId },
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
