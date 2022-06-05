import { errorResponse, successResponse } from "../../../utils";
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
    // manually pushing the verse token
    tokenAddresses.unshift({
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/S8v4cS7dnKzV6LYvzFPuuiWQMM4KSz7URuGYWMGXyTG/logo.png",
      token: "VERSE",
      tokenAddress: "S8v4cS7dnKzV6LYvzFPuuiWQMM4KSz7URuGYWMGXyTG",
      _id: "XOXOXOX",
      showOnZero: true,
    });
    return successResponse({ res, response: { tokenAddresses } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
