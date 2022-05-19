import { errorResponse, successResponse } from "../../../utils";

// not currently in use
// may remove after confirmation

export const getTweetsByUsernameController = async (req, res) => {
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
