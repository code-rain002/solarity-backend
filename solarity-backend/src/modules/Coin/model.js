import mongoose from "mongoose";

const Schema = mongoose.Schema;
const nftSchema = new Schema(
  {
    mint: {
      type: String,
      unique: true,
      required: true,
    },
    is_mutable: { type: Boolean },
    primary_sale_happened: { type: Boolean },
    update_authority: { type: String },
    explorer_url: { type: String },
    data: { type: Object },
    listing: { type: Object },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model("NFT", nftSchema, "nfts");
