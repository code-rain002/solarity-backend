import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    publicAddress: { type: String, required: false },
    assetsFollowing: { type: Array, required: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model("User", userSchema, "users");
