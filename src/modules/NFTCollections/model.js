import mongoose, { Schema } from "mongoose";

const nftCollectionSchema = new Schema(
  {
    symbol: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String },
    description: { type: String },
    image: { type: String },
    categories: { type: Array },
    candyMachineIds: { type: Array },
    website: { type: String },
    twitter: { type: String },
    discord: { type: String },
    floorPrice: { type: Number },
    listedCount: { type: Number },
    volumeAll: { type: Number },
    loaded: { type: Boolean },
    loaded2: { type: Boolean },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model(
  "NFTCollection",
  nftCollectionSchema,
  "nftCollections"
);
