import { errorResponse, successResponse } from "../../../utils";
import { getDaoMemberships } from "../helpers";
import DaoModel from "../model";

export const getDaosController = async (req, res) => {
  try {
    let {
      session: { userId },
      query: { member, term },
    } = req;
    const findOptions = {};
    if (member && userId) {
      const user = await req.profile();
      let memberIds = [];
      if (user.solanaAddress) {
        memberIds = await getDaoMemberships({
          walletAddress: user.solanaAddress,
          set: true,
          useCache: true,
        });
      }
      findOptions["_id"] = {
        $in: memberIds,
      };
    } else {
      if (term) {
        const searchRegex = new RegExp(`.*${term}.*`, "i");
        findOptions["$or"] = [
          {
            symbol: { $regex: searchRegex },
          },
          {
            name: { $regex: searchRegex },
          },
        ];
      }
    }
    const daos = await DaoModel.aggregate([
      {
        $match: findOptions,
      },
      {
        $addFields: { profileImageLink: "$profileImage.link" },
      },
      {
        $project: { name: 1, symbol: 1, profileImageLink: 1 },
      },
      {
        $limit: 20,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return successResponse({ res, response: { data: daos } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
