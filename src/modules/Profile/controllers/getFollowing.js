import {
  successResponse,
  errorResponse,
  throwError,
  getProfileData,
} from "../../../utils";
import DaoModel from "../../DAO/model";
import UserModel from "../../User/model";

export const getFollowingController = async (req, res) => {
  try {
    const {
      session: { userId },
      query: { type },
    } = req;
    const user = await UserModel.findById(userId);
    const {
      following: { users, daos },
    } = user;
    let response = [];
    if (type == "dao") {
      response = await DaoModel.find(
        { _id: { $in: daos } },
        {
          _id: 1,
          name: 1,
          symbol: 1,
        }
      );
      response = response.map((d) => d._doc);
      response.forEach((d) => {
        d.url = `api-mainnet.magiceden.dev/v2/collections/${d.symbol}/stats`;
      });
    }
    if (type == "user") {
      response = await UserModel.find({ _id: { $in: users } });
    }
    return successResponse({ res, response });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
