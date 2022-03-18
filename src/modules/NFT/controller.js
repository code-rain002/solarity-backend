import { Types } from "mongoose";
import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import { NftModel, NftAnalysisReportModel } from "../NFT/model";
import axios from "axios";

export const getNftsController = async (req, res) => {
  try {
    const {
      session: { userId },
      query: { page = 1, count = 10, term, ownedBy },
    } = req;
    const findOptions = {};
    if (ownedBy) {
      let publicAddress;
      if (ownedBy === "self") {
        const user = await UserModel.findById(userId, { publicAddress: 1 });
        publicAddress = user.publicAddress;
      } else {
        const user = await UserModel.findOne(
          { username: ownedBy },
          { publicAddress: 1 }
        );
        if (!user) throwError("User doesn't exist");
        if (user && !user.publicAddress) {
          throwError("User did not attach public address to their account");
        }
        publicAddress = user.publicAddress;
      }
      findOptions.owner = publicAddress;
    }
    if (term) {
      let searchTerm = new RegExp(term.toLowerCase(), "i");
      findOptions[$or] = [
        { title: searchTerm },
        { description: searchTerm },
        { mint: searchTerm },
      ];
    }
    const totalCount = await NftModel.count(findOptions);
    const totalPages = Math.ceil(totalCount / count);
    const data = await NftModel.find(findOptions, {
      title: 1,
      mint: 1,
      preview_URL: 1,
      mint: 1,
    }).skip((page - 1) * count);
    return successResponse({ res, response: { totalCount, totalPages, data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftController = async (req, res) => {
  try {
    const {
      params: { mint },
      session: { userId },
    } = req;
    const { publicAddress } = await UserModel.findById(userId, {
      publicAddress: 1,
    });
    let nft = await NftModel.findOne({ mint });
    if (nft.owner == publicAddress) {
      nft = { ...nft._doc, owned: true };
    } else {
      nft = { ...nft._doc, owned: false };
    }
    return successResponse({ res, response: { nft } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftFromMagicEdenController = async (req, res) => {
  try {
    const {
      params: { mint },
    } = req;
    const { data } = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/tokens/${mint}`
    );
    return successResponse({ res, response: data });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const nftAnalysisController = async (req, res) => {
  try {
    const {
      body: {
        collectionSymbols = [],
        nftMintAddresses = [],
        startTime,
        endTime,
      },
      session: { userId },
    } = req;

    // check if ran analysis in the last 24 hours
    const user = await UserModel.findById(userId, { lastAnalysisTime: 1 });

    const hourDifference = Math.abs(user.lastAnalysisTime - new Date()) / 36e5;
    if (hourDifference <= 24) {
      throwError("You can run the analysis once every 24 hours");
    }

    const mintAddresses = [...nftMintAddresses];

    if (collectionSymbols.length > 0) {
      // fetch all the nft addresses and add them to the all array
    }

    const theblockchainapi = req.app.get("theblockchainapi");
    const api = new theblockchainapi.SolanaNFTMarketplacesApi();

    const validateTime = (timestamp) => new Date(timestamp).getTime() > 0;
    if (
      (endTime && !validateTime(endTime)) ||
      (startTime && !validateTime(startTime) && startTime != -1)
    ) {
      throwError("Invalid time parameters provided");
    }

    let opts = {
      nFTAnalyticsRequest: new theblockchainapi.NFTAnalyticsRequest(
        mintAddresses,
        startTime,
        endTime
      ),
    };

    if (startTime) {
      opts.nFTAnalyticsRequest["start_time"] = startTime;
    }
    if (endTime) {
      opts.nFTAnalyticsRequest["end_time"] = endTime;
    }

    const analysis = await api.solanaGetNFTMarketplaceAnalytics(opts);

    const lastAnalysisTime = new Date();

    await NftAnalysisReportModel.updateOne(
      {
        userId: Types.ObjectId(userId),
      },
      {
        analysis,
      },
      { upsert: true }
    );

    await UserModel.updateOne({ _id: userId }, { lastAnalysisTime });

    return successResponse({ res, response: { analysis } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftAnalysisController = async (req, res) => {
  try {
    const analysis = await NftAnalysisReportModel.findOne({
      userId: req.session.userId,
    });
    return successResponse({ res, response: { analysis } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
