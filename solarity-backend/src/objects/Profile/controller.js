import { successResponse, errorResponse, throwError } from "../../helpers";
import UserModel from "../User/model";
import NftModel from "../NFT/model";
import { getNFTPrice } from "../../helpers/nftHelpers";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    if (!user) {
      await res.session.destroy();
      throwError("Invalid Credentials");
    }
    return successResponse({ res, response: { user } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const updateProfile =
  (updateType = null) =>
  async (req, res) => {
    try {
      const { userId } = req.session;

      // altering the req.body before saving if update type is set
      switch (updateType) {
        case "coinWatchlist":
          req.body.coinWatchlist = await validateCoin(req);
          break;
        case "nftWatchlist":
          req.body.nftWatchlist = await validateNft(req);
          break;
      }
      //

      await UserModel.findByIdAndUpdate(userId, req.body);
      return successResponse({ res });
    } catch (err) {
      return errorResponse({ res, err });
    }
  };

export const getNftOwned = async (req, res) => {
  try {
    const theblockchainapi = req.app.get("theblockchainapi");
    const apiInstance = new theblockchainapi.SolanaWalletApi();
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    const { publicAddress } = user;
    const result = await apiInstance.solanaGetNFTsBelongingToWallet(
      "mainnet-beta",
      publicAddress
    );
    return successResponse({ res, response: { result } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

export const getCoinWatchList = async (req, res) => {
  try {
    // fetch latest prices
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    const { assetsFollowing } = user;
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ err, res });
  }
};

export const getNftWatchList = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await UserModel.findById(userId);
    const { nftWatchlist } = user;
    const nfts = await NftModel.find({ mint: { $in: nftWatchlist } });
    return successResponse({ res, response: { nfts } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

// helpers
const validateNft = async ({ body: { addresses }, app }) => {
  // create the classes to fetch
  const theblockchainapi = app.get("theblockchainapi");
  const nftApi = new theblockchainapi.SolanaNFTApi();
  const marketplaceApi = new theblockchainapi.SolanaNFTMarketplacesApi();

  // create array of promises to fetch nft meta data
  const nftMetaDataFetches = addresses.map((address) =>
    nftApi.solanaGetNFT("mainnet-beta", address)
  );
  const result = await Promise.allSettled(nftMetaDataFetches);
  const resultErrors = result.find(({ status }) => status !== "fulfilled");
  if (resultErrors) throwError("One of the provided NFT address is invalid");
  const nftDetails = result.map(({ value }) => value);

  // create array of promises to fetch nft prices
  const nftPriceFetches = addresses.map((address) =>
    marketplaceApi.solanaGetNFTListing("mainnet-beta", address)
  );

  const priceResult = await Promise.all(nftPriceFetches);
  const priceErrors = result.find(({ status }) => status !== "fulfilled");
  if (priceErrors) throwError("One of the provided NFT address is invalid");

  priceResult.map((listing) => {
    const nft = nftDetails.find((x) => x.mint == listing.mint_address);
    if (nft) {
      nft.listing = listing;
    }
  });

  NftModel.bulkWrite(
    nftDetails.map((nftDetail) => ({
      updateOne: {
        filter: { mint: nftDetail.mint },
        update: { $set: nftDetail },
        upsert: true,
      },
    }))
  );
  return addresses;
};

const validateCoin = async ({ body: { coins }, app }) => {
  console.log(coins);
  return coins;
};
