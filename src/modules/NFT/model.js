import mongoose from "mongoose";

const Schema = mongoose.Schema;
const nftSchema = new Schema(
  {
    mint: {
      type: String,
      unique: true,
      required: true,
    },
    items: {
      type: Array,
    },
    creators: {
      type: Array,
    },
    tags: {
      type: Array,
    },
    nsfw: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    preview_URL: {
      type: String,
    },
    title: {
      type: String,
    },
    jsonUrl: {
      type: String,
    },
    pubkey: {
      type: String,
    },
    properties: {
      type: Object,
    },
    owner: {
      type: Object,
    },
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
