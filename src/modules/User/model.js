import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    twitterUsername: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    twitterId: { type: Number, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    publicAddress: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    coinWatchlist: { type: Array, required: false },
    nftWatchlist: { type: Array, required: false },
    lastNftAnalysis: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model("User", userSchema, "users");
