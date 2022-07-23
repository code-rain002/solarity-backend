import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../../User/model";
import DaoModel from "../../DAO/model";
import axios from "axios";
import { userAddFields, userUnsetFields } from "../../User/shared";
import { getProfileData } from '../../../utils'

export const updateProfileDaosController = async (req, res) => {
  try {
    const {
      session: { userId },
      // body: { domain },
      // query: { includeDao },
    } = req;
    // const userData = await UserModel.aggregate([
    //   {
    //     $match: { _id: userId },
    //     // { solanaAddress: id },
    //     // { ethereumAddress: id },
    //     // { "externalLinks.twitter.username": id },
    //   },
    //   {
    //     $addFields: userAddFields,
    //   },
    //   { $unset: userUnsetFields },
    // ]);

    const userData = await UserModel.find({ _id: userId })

    if (userData.length == 0) throwError("No user with the domain exists");

    let user = userData[0];

    if (user.solanaAddress) {
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
          },
          {
            $addFields: { profileImageLink: "$profileImage.link" }
          }
        );
      } catch { }
      // console.log(daos)

      await UserModel.updateOne(
        { _id: userId },
        {
          daos: daos,
          // "stepsCompleted.daoClaimed": true,
        }
      );

      // user = { ...userData[0], daos };
    }

    const profile = await getProfileData(userId);
    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
