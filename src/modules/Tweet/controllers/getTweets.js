import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../../User/model";
import DaoModel from "../../DAO/model";
import { Types } from "mongoose";

export const getTweetsController = async (req, res) => {
  try {
    let {
      query: { maxResults, username, symbol },
      session: { userId: loggedInUserId },
    } = req;
    const twitterApi = req.app.get("twitterApi");
    let twitterUsername;
    if (!maxResults) maxResults = 100;
    if (symbol) {
      let dao;
      try {
        const findOptions = {};
        findOptions.symbol = symbol;
        dao = await DaoModel.findOne(findOptions, { externalLinks: 1 });
        if (!dao) throw false;
        twitterUsername = dao.externalLinks.twitter.username;
      } catch (err) {
        throwError("No DAO with the provided symbol exists");
      }
    } else {
      let user;
      try {
        const findOptions = {};
        if (username) {
          findOptions.username = username;
        } else {
          findOptions["_id"] = new Types.ObjectId(loggedInUserId);
        }
        user = await UserModel.findOne(findOptions, { externalLinks: 1 });
        if (!user) throw false;
        twitterUsername = user.externalLinks.twitter.username;
      } catch (err) {
        throwError("No user with the provided User Id exists");
      }
      if (!twitterUsername) {
        throwError("No twitter account associated with the profile");
      }
    }
    let data = [];
    if (twitterUsername) {
      const {
        data: { id },
      } = await twitterApi.v2.userByUsername(twitterUsername);
      const timeline = await twitterApi.v1.userTimeline(id, {
        max_results: maxResults,
        include_rts: true,
        exclude_replies: true,
      });
      const { _realData } = timeline;
      data = _realData;
    }
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
