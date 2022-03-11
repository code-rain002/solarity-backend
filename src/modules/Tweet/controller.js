import { errorResponse, successResponse, throwError } from "../../helpers";
import UserModel from "../User/model";

export const getTweets = async (req, res) => {
  try {
    let {
      query: { maxResults, userId, communityId },
      session: { userId: loggedInUserId },
    } = req;
    const twitterApi = req.app.get("twitterApi");
    let twitterId;
    if (!maxResults) maxResults = 20;
    if (communityId) {
      // tweets for communities here!
    } else {
      let tempUserId = loggedInUserId;
      if (userId) tempUserId = userId;
      let user;
      try {
        user = await UserModel.findById(tempUserId);
      } catch {
        throwError("No user with the provided User Id exists");
      }
      twitterId = user.twitterId;
    }
    const timeline = await twitterApi.v1.userTimeline(twitterId, {
      max_results: maxResults,
      exclude: ["replies", "retweets"],
    });
    const { _realData: data } = timeline;
    console.log(data);
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
