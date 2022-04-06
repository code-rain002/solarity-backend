import {
  errorResponse,
  getCollectionsOwned,
  successResponse,
} from "../../../helpers";
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
      const ownedCollections = await getCollectionsOwned(user.publicAddress);
      const names = ownedCollections.map(({ name }) => name);
      findOptions["collectionInfo.name"] = {
        $in: names,
      };
      console.log(findOptions);
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
