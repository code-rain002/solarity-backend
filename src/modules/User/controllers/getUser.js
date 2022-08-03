import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../model";
import DaoModel from "../../DAO/model";
import axios from "axios";
import { userAddFields, userUnsetFields } from "../shared";

export const getUserController = async (req, res) => {
  try {
    const {
      params: { id },
      query: { includeDao },
    } = req;
    const userData = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { username: id },
            { solanaAddress: id },
            { ethereumAddress: id },
            { "externalLinks.twitter.username": id },
          ],
        },
      },
      {
        $addFields: userAddFields,
      },
      { $unset: userUnsetFields },
    ]);

    if (userData.length == 0) throwError("No user with the username exists");

    let user = userData[0];

    if (includeDao && user.solanaAddress) {
      let daos = [];
      try {
        const { data: nfts } = await axios.get(
          `https://api.all.art/v1/wallet/${user.solanaAddress}`
        );
        const allNfts = [...nfts.unlistedNfts, ...nfts.listedNfts];
        const families = [
          ...new Set(
            allNfts
              .map(
                ({ Properties }) =>
                  Properties.collection && Properties.collection.family
              )
              .filter((x) => x !== undefined)
          ),
        ];

        daos = await DaoModel.find(
          {
            "collectionInfo.family": {
              $in: families,
            },
          },
          {
            name: 1,
            symbol: 1,
            description: 1,
            profileImage: 1
          }
        );
      } catch {}
      user = { ...userData[0], daos };
    }
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
