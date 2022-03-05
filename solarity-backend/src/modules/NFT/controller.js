import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import { NftModel, NftCollectionModel } from "../NFT/model";
import { getNftCollectionStats } from "../../helpers/magicedenHelpers";

export const getNftCollections = async (req, res) => {
  try {
    const collection = await NftCollectionModel.find();
    if (!collection) throwError("No such collection exist");
    return successResponse({ res, response: { collection } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftCollectionsFollowing = async (req, res) => {
  try {
    const collection = await NftCollectionModel.find();
    if (!collection) throwError("No such collection exist");
    return successResponse({ res, response: { collection } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getNftCollection = async (req, res) => {
  try {
    const {
      params: { symbol },
    } = req;
    const collection = await NftCollectionModel.findOne({ symbol });
    if (!collection) throwError("No such collection exist");
    const nfts = await NftModel.find({ symbol });
    return successResponse({ res, response: { collection, nfts } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const addNftCollection = async (req, res) => {
  try {
    const {
      session: { userId },
      body: { symbol },
    } = req;
    // get the user
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
      nftWatchlist: [...nftWatchlist, symbol],
    });
    // respond with the collection
    return successResponse({ res, response: { result } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// checked
export const removeNftCollection = async (req, res) => {
  try {
    const {
      session: { userId },
      params: { symbol },
    } = req;
    const user = await UserModel.findById(userId);
    const { nftWatchlist } = user;
    if (nftWatchlist.includes(symbol)) {
      const newNftWatchlist = nftWatchlist.filter((id) => id != symbol);
      await UserModel.findByIdAndUpdate(userId, {
        nftWatchlist: newNftWatchlist,
      });
    }
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
