import _ from "lodash";
import { errorResponse, successResponse } from "../../helpers";

export const getTweets = async (req, res) => {
  try {
    const { username } = req.params;
    const twitterApi = req.app.get("twitterApi");

    const {
      data: { id },
    } = await twitterApi.v2.userByUsername(username);
    const timeline = await twitterApi.v1.userTimeline(id, {
      exclude: ["replies", "retweets"],
    });
    const { _realData: data } = timeline;
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
