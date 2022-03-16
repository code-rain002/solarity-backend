import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
const nftSchema = new Schema(
  {
    mint: {
      type: String,
      unique: true,
      required: true,
    },
    items: Array,
    creators: Array,
    tags: Array,
    nsfw: Boolean,
    description: String,
    preview_URL: String,
    title: String,
    jsonUrl: String,
    pubkey: String,
    properties: Object,
    owner: String,
    seller: String,
    price: Number,
    listingUrl: String,
    tokenAddress: String,
    pdaAddress: String,
    symbol: String,
    tokenSize: Number,
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

const nftAnalysisReportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
    },
    analysis: {
      type: Object,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export const NftModel = mongoose.model("NFT", nftSchema, "nfts");
export const NftAnalysisReportModel = mongoose.model(
  "NftAnalysisReport",
  nftAnalysisReportSchema,
  "nftAnalysisReports"
);
