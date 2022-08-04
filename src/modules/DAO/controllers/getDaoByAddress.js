import { errorResponse, successResponse, throwError } from "../../../utils";
import DaoModel from "../model";
import axios from "axios";

export const getDaoByAddressController = async (req, res) => {
  try {
    const {
      params: { address },
      query: { includeDao },
    } = req;

    if (includeDao && address) {
      try {
        const { data: nfts } = await axios.get(
          `https://api.all.art/v1/wallet/${address}`
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

        const daos = await DaoModel.find(
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

        return successResponse({ res, response: { daos } });
      } catch(error) {
        console.log(error)
        return errorResponse({ res, error });
      }
    }
  } catch (err) {
    return errorResponse({ res, err });
  }
};
