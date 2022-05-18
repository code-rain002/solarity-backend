import { successResponse, errorResponse } from "../../../utils";
import UserModel from "../../User/model";
import axios from "axios";

export const getEthereumNFTsController = async (req, res) => {
  try {
    const {
      query: { owner },
    } = req;
    const user = await UserModel.findOne({ username: owner });
    let nfts = [];
    if (user && user.ethereumAddress) {
      const {
        data: { ownedNfts },
      } = await axios.get(
        `${process.env.ALCHEMY_HTTP}/getNFTs/?owner=${user.ethereumAddress}`
      );
      nfts = ownedNfts;
    }
    return successResponse({ res, response: { nfts } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
