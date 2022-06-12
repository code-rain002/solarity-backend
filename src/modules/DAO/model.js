import mongoose from "mongoose";
import { string } from "yup";

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
    discord: {
      guildId: { type: String, trim: true },
      channelId: { type: String, trim: true },
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
    floorPrice: {
      value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
      lastUpdate: {
        type: Date,
      },
    },
    token: { type: String },
    tokenAddress: { type: String },
    stackingRewards: { type: Number, default: 0 },
    collectionInfo: { name: { type: String }, family: { type: String } },
    collections: [
      {
        collectionId: [mongoose.Types.ObjectId],
        primary: Boolean,
      },
    ],
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);

const DaoModel = mongoose.model("DAO", daoSchema, "daos");

export default DaoModel;
