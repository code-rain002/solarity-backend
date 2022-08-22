import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, 
      required: false, 
      trim: true,
    },
    creator: {
      avatar: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true }
    },
    friends: [
      {
        avatar: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true }
      }
    ],
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);

const EventModel = mongoose.model("Event", eventSchema, "events");

export default EventModel;
