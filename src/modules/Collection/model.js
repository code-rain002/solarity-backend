import mongoose from "mongoose";
import { string } from "yup";

const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
    },
    supply: { type: Number, default: 0 },
    nfts: { type: [String], default: [] },
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);

const CollectionModel = mongoose.model(
  "Collection",
  collectionSchema,
  "collections"
);

export default CollectionModel;
