import { errorResponse, successResponse, throwError } from "../../../helpers";
import DaoModel from "../model";

export const getSingleDaoController = async (req, res) => {
  try {
    console.log(req);
    const { symbol } = req.params;
    const dao = await DaoModel.aggregate([
      {
        $match: { symbol },
      },
      {
        $addFields: {
          profileImageLink: "$profileImage.link",
          twitterUsername: "$externalLinks.twitter.username",
          githubUsername: "$externalLinks.github.username",
          discordHandle: "$externalLinks.discord.handle",
        },
      },
    ]);
    if (dao.length == 0) throwError("No DAO exists with the matching symbol");
    return successResponse({ res, response: { dao: dao[0] } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
