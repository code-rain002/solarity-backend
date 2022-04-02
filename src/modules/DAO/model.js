import mongoose from "mongoose";

const Schema = mongoose.Schema;
const daoSchema = new Schema(
  {
    symbol: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    externalLinks: {
      twitter: {
        id: String,
        username: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
      github: {
        username: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
      discord: {
        handle: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
    },
    profileImage: {
      link: { type: String, required: false, trim: true },
      address: { type: String, required: false, trim: true },
    },
    followerCount: { type: Number, required: false, default: 0 },
    visible: {
      type: Boolean,
      default: false,
    },
    supply: { type: Number, default: 0 },
    floorPrice: { type: Number, default: 0 },
    token: { type: String },
    stackingRewards: { type: Number, default: 0 },
    nftCollection: { type: [String], default: [] },
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);

const DaoModel = mongoose.model("DAO", daoSchema, "daos");

export default DaoModel;
