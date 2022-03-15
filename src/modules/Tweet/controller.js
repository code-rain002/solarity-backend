import { errorResponse, successResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import { Types } from "mongoose";

export const getTweets = async (req, res) => {
  try {
    let {
      query: { maxResults, username, communityId },
      session: { userId: loggedInUserId },
    } = req;
    const twitterApi = req.app.get("twitterApi");
    let twitterId;
    if (!maxResults) maxResults = 20;
    if (communityId) {
    } else {
      let user;
      try {
        const findOptions = {};
        if (username) {
          findOptions.username = username;
        } else {
          findOptions["_id"] = new Types.ObjectId(loggedInUserId);
        }
        user = await UserModel.findOne(findOptions, { twitterId: 1 });
      } catch (err) {
        console.log(err);
        throwError("No user with the provided User Id exists");
      }
      twitterId = user.twitterId;
      if (!twitterId) {
        throwError("No twitter account associated with the profile");
      }
    }
    const timeline = await twitterApi.v1.userTimeline(twitterId, {
      max_results: maxResults,
      exclude: ["replies", "retweets"],
    });
    const { _realData: data } = timeline;
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getTweetsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const twitterApi = req.app.get("twitterApi");
    const user = await twitterApi.v2.userByUsername(username);
    const {
      data: { id },
    } = user;
    const timeline = await twitterApi.v1.userTimeline(id, {
      exclude: ["replies", "retweets"],
    });
    const { _realData: data } = timeline;
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
