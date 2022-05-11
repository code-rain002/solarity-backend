import { errorResponse, successResponse } from "../../../helpers";
import DaoModel from "../model";

export const getDaoTokensController = async (req, res) => {
  try {
    const tokenAddresses = await DaoModel.aggregate([
      {
        $addFields: { image: "$profileImage.link" },
      },
      {
        $project: { token: 1, tokenAddress: 1, image: 1 },
      },
      { $match: { tokenAddress: { $ne: undefined } } },
    ]);
    return successResponse({ res, response: { tokenAddresses } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
