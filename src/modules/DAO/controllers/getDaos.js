import { errorResponse, successResponse } from "../../../helpers";
import DaoModel from "../model";

export const getDaosController = async (req, res) => {
  try {
    let { member, term } = req.query;
    const findOptions = {};
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
    return successResponse({ res, response: { daos } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
