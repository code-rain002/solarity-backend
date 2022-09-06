import mongoose from "mongoose";

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    users: [
      { 
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: { type: Boolean, required: true },  //false: Normal, true: Group
    msgs: [
      {
        type: new mongoose.Schema(
          {
            sender: { 
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            content: { type: String, default: "" },
            attachments: {
              fileExists: { type: Boolean, default: false },
              files: [
                {
                  name: {type: String, trim: true},
                  url: { type: String, trim: true }
                }
              ]
            },
            readState: { type: Boolean, default: false },
            reply: { 
              replying: { type: Boolean, default: false },
              replyId: { type: String, trim: true },
              replyToWhom: { type: String, default: "" },
              hisMsg: { type: String, default: "" }
            },
            editState: { type: Boolean, default: false },
            deleteState: { type: Boolean, default: false },
          },
          { timestamps: true }
        )
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
