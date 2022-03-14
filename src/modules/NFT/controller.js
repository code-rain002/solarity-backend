import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import { NftModel, NftCollectionModel } from "../NFT/model";
import { getNftCollectionStats } from "../../helpers/magicedenHelpers";

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

export const getNftCollections = async (req, res) => {
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

export const getNftCollection = async (req, res) => {
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
