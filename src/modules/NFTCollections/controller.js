import { Types } from "mongoose";
import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import NftCollectionModel from "./model";
import {
  fetchAllNftInCollection,
  getNftCollectionStats,
} from "../../helpers/magicedenHelpers";
import { Promise } from "bluebird";
import axios from "axios";

// export const statCollections = async (req, res) => {
//   try {
//     const symbols = await NftCollectionModel.find({}, { symbol: 1, loaded: 1 });
//     let count = 1;
//     await Promise.each(symbols, async ({ symbol, loaded2 }) => {
//       if (!loaded2) {
//         try {
//           const nfts = await fetchAllNftInCollection(symbol);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     });
//     return successResponse({ res });
//   } catch (err) {
//     return errorResponse({ res, err });
//   }
// };

export const getNftCollectionsController = async (req, res) => {
  try {
    const {
      session: { userId },
      query: { following },
    } = req;
    const findOptions = {};
    if (following) {
      const user = await UserModel.findById(userId);
      const { nftWatchlist } = user;
      findOptions.symbol = { $in: nftWatchlist };
    }
    const collections = await NftCollectionModel.find(findOptions);
    return successResponse({ res, response: { collections } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftCollectionController = async (req, res) => {
  try {
    const {
      query: { excludeNfts },
      params: { symbol },
    } = req;
    const collection = await NftCollectionModel.findOne({ symbol });
    const { loaded } = collection;
    if (!loaded) {
      const nftQueue = req.app.get("nftQueue");
      nftQueue.now("fetchCollection", symbol);
    }
    const response = { collection };
    if (!collection) throwError("No such collection exist");
    if (!excludeNfts) {
      if (loaded) {
        const nfts = await NftModel.find({ symbol });
        response.nfts = nfts;
      }
    }
    return successResponse({ res, response });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// $push!!!
export const addNftCollection = async (req, res) => {
  try {
    const {
      session: { userId },
    } = req;
    let {
      body: { symbol },
    } = req;
    // get the user
    symbol = symbol.toLowerCase();
    const user = await UserModel.findById(userId);
    // get the current nft watch list
    const { nftWatchlist } = user;
    // check if provided symbol exists in the watch list
    if (nftWatchlist.includes(symbol)) {
      // throw error if it does
      throwError("You are already watching this collection");
    }
    // get the entry from the data
    const existingEntry = await NftCollectionModel.findOne({ symbol });
    let result;
    // if entry doesn't exist then create one using the helper function
    if (!existingEntry) {
      result = await getNftCollectionStats(symbol);
    }
    const nftQueue = req.app.get("nftQueue");
    nftQueue.now("fetchCollection", symbol);
    // update the user watch list
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        nftWatchlist: symbol,
      },
    });
    // respond with the collection
    return successResponse({ res, response: { result } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const removeNftCollection = async (req, res) => {
  try {
    const {
      session: { userId },
      params: { symbol },
    } = req;
    await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        nftWatchlist: symbol,
      },
    });
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
