import mongoose from "mongoose";

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    users: [
      {
        userId: { type: String, required: true },
      }
    ],
    type: { type: String, required: true },  //first: Normal, second: Group
    msgs: [
      {
        sender: { type: String, required: true },
        receiver: { type: String, required: true },
        content: { type: String, default: "" },
        attachment: { type: String, default: "" },
        readState: { type: Boolean, default: false },
        replyId: { type: String, default: "" },
        editState: { type: Boolean, default: false },
        deleteState: { type: Boolean, default: false },
        created_at: { type: String, trim: true }
      }
    ],
    blockState: { type: Boolean, default: false },
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);
const ChatModel = mongoose.model("Chat", chatSchema, "chats");

export default ChatModel;
