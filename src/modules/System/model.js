import mongoose, { Schema } from "mongoose";

const systemSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: false,
    toJSON: { getters: true },
  }
);

const SystemModel = mongoose.model("System", systemSchema, "systems");

export default SystemModel;
