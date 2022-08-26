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
    type: {
      type: String,
      required: true,
    },
    creator: {
      avatar: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true }
    },
    friends: [
      {
        avatar: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        link: { type: String, required: true, trim: true },
      }
    ],
    isPrivate: {
      type: Boolean,
      default: false
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
