import { errorResponse, successResponse, throwError } from "../../helpers";
import UserModel from "./model";
import DaoModel from "../DAO/model";

import { Types } from "mongoose";
import axios from "axios";

const USER_DATA_UNSET = {
  following: 0,
  createdAt: 0,
  updatedAt: 0,
  nonce: 0,
  profileImage: 0,
  stepsCompleted: 0,
  visible: true,
  externalLinks: 0,
};

const USER_DATA_ADD_FIELDS = {
  profileImageLink: "$profileImage.link",
  profileImageAddress: "$profileImage.address",
  twitterUsername: "$externalLinks.twitter.username",
  githubUsername: "$externalLinks.github.username",
  discordUsername: "$externalLinks.discord.username",
  discordConnected: "$externalLinks.discord.connected",
  twitterConnected: "$externalLinks.twitter.connected",
  ethereumWalletAddress: "$ethereum.walletAddress",
  ethereumConnected: "$ethereum.connected",
};

// NOT OK!!! ADD AGGREGATE HERE!!!!!!!!!!
export const getUsersController = async (req, res) => {
  try {
    const {
      query: { page = 1, count = 10, term = "" },
    } = req;
    let searchTerm = new RegExp(term.toLowerCase(), "i");

    const data = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { username: searchTerm },
            { email: searchTerm },
            { fullName: searchTerm },
          ],
        },
      },
      {
        $addFields: USER_DATA_ADD_FIELDS,
      },
      { $unset: Object.keys(USER_DATA_UNSET) },
    ]);

    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getRoomInfoController = async (req, res) => {
  try {
    const {
      params: { name: name, roomNo: roomNo },
    } = req;

    const user = await UserModel.findOne({
      username: name,
      "rooms.roomNo": roomNo,
    });
    const roomInfoData = user.rooms.find((s) => s.roomNo == roomNo);
    return successResponse({ res, response: { roomInfoData } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const data = await UserModel.find();
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// OK
export const getUserController = async (req, res) => {
  try {
    const {
      params: { id },
      query: { includeDao },
    } = req;
    const userData = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { username: id },
            { solanaAddress: id },
            { ethereumAddress: id },
            { "externalLinks.twitter.username": id },
          ],
        },
      },
      {
        $addFields: USER_DATA_ADD_FIELDS,
      },
      { $unset: Object.keys(USER_DATA_UNSET) },
    ]);
    if (userData.length == 0) throwError("No user with the username exists");
    let user = userData[0];
    if (includeDao && user.solanaAddress) {
      let daos = [];
      try {
        const { data: nfts } = await axios.get(
          `https://api.all.art/v1/wallet/${user.solanaAddress}`
        );
        const allNfts = [...nfts.unlistedNfts, ...nfts.listedNfts];
        const families = [
          ...new Set(
            allNfts
              .map(
                ({ Properties }) =>
                  Properties.collection && Properties.collection.family
              )
              .filter((x) => x !== undefined)
          ),
        ];
        daos = await DaoModel.find(
          {
            "collectionInfo.family": {
              $in: families,
            },
          },
          {
            name: 1,
            symbol: 1,
            description: 1,
          }
        );
      } catch {}
      user = { ...userData[0], daos };
    }
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getUserWithWalletAddressController = async (req, res) => {
  try {
    const {
      params: { address: address },
    } = req;
    const user = await UserModel.aggregate([
      {
        $match: { solanaAddress: address },
      },
      {
        $addFields: USER_DATA_ADD_FIELDS,
      },
      { $unset: Object.keys(USER_DATA_UNSET) },
    ]);
    if (user.length == 0) throwError("No user with the current wallet exists");
    return successResponse({ res, response: { user: user[0] } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getUserFollowingStatusController = async (req, res) => {
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
