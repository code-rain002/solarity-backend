import mongoose from "mongoose";
import { boolean } from "yup";

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
    domain: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
    },
    solanaAddress: {
      type: String,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { solanaAddress: { $type: "string" } },
      },
    },
    ethereumAddress: {
      type: String,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { ethereumAddress: { $type: "string" } },
      },
    },
    bio: { type: String, required: false, trim: true },
    title: { type: String, required: false, trim: true },
    externalLinks: {
      twitter: {
        id: String,
        username: String,
        accessToken: String,
        refreshToken: String,
        connected: {
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
        username: String,
        accessToken: String,
        refreshToken: String,
        connected: {
          type: Boolean,
          default: false,
        },
      },
    },
    profileImage: {
      link: { type: String, required: false, trim: true },
      network: { type: String, required: false, trim: true },
      contractAddress: { type: String, required: false, trim: true },
      tokenId: { type: String, required: false, trim: true },
      mintAddress: { type: String, required: false, trim: true },
    },
    isNftSelectedAsAvatar: { type: Boolean, default: false },
    followerCount: { type: Number, required: false, default: 0 },
    following: {
      users: { type: [mongoose.Types.ObjectId], required: false },
      daos: { type: [mongoose.Types.ObjectId], required: false },
      coins: { type: [mongoose.Types.ObjectId], required: false },
      nfts: { type: [mongoose.Types.ObjectId], required: false },
    },
    daoMemberships: {
      checked: {
        type: Boolean,
        default: false,
      },
      daoIds: {
        type: [mongoose.Types.ObjectId],
        default: [],
      },
      required: false,
    },
    daos: [
      {
        name: { type: String, required: false },
        symbol: { type: String, required: false, trim: true },
        description: { type: String, required: false, trim: true },
        profileImageLink: { type: String, required: false, trim: true }
      }
    ],
    passportNftAddress: { type: String, required: false, trim: true, unique: true },
    rooms: [
      {
        roomId: { type: mongoose.Types.ObjectId, required: false },
        roomNo: { type: Number },
        title: { type: String, required: true },
        subTitle: { type: String },
        currentBid: { type: Number, required: true },
        imageUrl: { type: String },
        modelAssets: { type: Object },
        active: { type: Boolean, default: false },
        nftStates: [
          {
            no: { type: Number },
            nftAddress: { type: String, trim: true },
            link: { type: String, required: false },
          },
        ],
      },
    ],
    invitations: [
      {
        name: { type: String, required: true },
        invitor: { type: String },
        roomId: { type: String },
        type: { type: Boolean },
        roomNo: { type: Number },
        roomName: { type: String },
        link: { type: String },
        state: { type: Boolean },
      },
    ],
    nonce: String,
    lastAnalysisTime: Date,
    visible: {
      type: Boolean,
      default: false,
    },
    stepsCompleted: {
      infoAdded: {
        type: Boolean,
        default: false,
      },
      accountsLinked: {
        type: Boolean,
        default: false,
      },
      daoClaimed: {
        type: Boolean,
        default: false,
      },
      profilePicUpdated: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    autoIndex: true,
    timestamps: true,
    toJSON: { getters: true },
  }
);
const UserModel = mongoose.model("User", userSchema, "users");

export default UserModel;
