import { successResponse, errorResponse, throwError } from "../../../helpers";
import UserModel from "../../User/model";
import Moralis from "moralis/node";
import axios from "axios";

export const getEthereumNFTsController = async (req, res) => {
  try {
    const {
      query: { owner },
    } = req;
    const { ethereumAddress } = await UserModel.findOne({ username: owner });
    let nfts = [];
    if (ethereumAddress) {
      const {
        data: { ownedNfts },
      } = await axios.get(
        `${process.env.ALCHEMY_HTTP}/getNFTs/?owner=${ethereumAddress}`
      );
      nfts = ownedNfts;
    }
    return successResponse({ res, response: { nfts } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
