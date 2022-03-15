import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
    },
    publicAddress: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      sparse: true,
    },
    fullName: { type: String, trim: true },
    bio: { type: String, required: false, trim: true },
    password: { type: String },
    twitterUsername: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    twitterId: { type: Number, required: false, unique: true, sparse: true },
    githubUsername: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    discordHandle: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    profileImageLink: {
      type: String,
      required: false,
      trim: true,
    },
    followers: { type: [mongoose.Types.ObjectId], required: false },
    following: {
      users: { type: [mongoose.Types.ObjectId], required: false },
      daos: { type: [mongoose.Types.ObjectId], required: false },
      coins: { type: [mongoose.Types.ObjectId], required: false },
      nfts: { type: [mongoose.Types.ObjectId], required: false },
    },
    nonce: { type: String },
    lastAnalysisTime: { type: Date },
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);
const UserModel = mongoose.model("User", userSchema, "users");

export default UserModel;
