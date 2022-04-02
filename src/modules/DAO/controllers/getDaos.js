import {
  errorResponse,
  getCollectionsOwned,
  successResponse,
} from "../../../helpers";
import DaoModel from "../model";

export const getDaosController = async (req, res) => {
  try {
    let { member, term } = req.query;
    const findOptions = {};
    if (member) {
      const ownedCollections = await getCollectionsOwned(
        "31W6QazPT8dSXvWLCg8yPktLga5nSg6cXysbwnuSQPPu"
      );
      console.log(ownedCollections);
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
    return successResponse({ res, response: { daos } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
