import mongoose from "mongoose";

const Schema = mongoose.Schema;
const nftSchema = new Schema(
  {
    tokenMint: {
      type: String,
      unique: true,
      required: true,
    },
    symbol: { type: String },
    pdaAddress: { type: String },
    auctionHouse: { type: String },
    tokenAddress: { type: String },
    seller: { type: String },
    tokenSize: { type: Number },
    price: { type: Number },
    listingUrl: { type: String },
    listing: { type: Object },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

const nftCollectionSchema = new Schema(
  {
    symbol: {
      type: String,
      unique: true,
      required: true,
    },
    loaded: { type: Boolean },
    floorPrice: { type: Number },
    listedCount: { type: Number },
    volumeAll: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export const NftModel = mongoose.model("NFT", nftSchema, "nfts");
export const NftCollectionModel = mongoose.model(
  "NFTCollection",
  nftCollectionSchema,
  "nftCollections"
);
