import _ from "lodash";
import { errorResponse, successResponse } from "../../helpers";
import NftCollections from "../NFTCollections/model";

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

export const getCollections = async (req, res) => {
  try {
    const { symbol } = req.params;
    const collection = await NftCollections.findOne({ symbol });
    return successResponse({ res, response: { collection } });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};
