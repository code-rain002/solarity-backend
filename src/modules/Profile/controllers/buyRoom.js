import { successResponse, errorResponse } from "../../../utils";
import UserModel from "../../User/model";

export const buyRoomController = async (req, res) => {
  try {
    const {
      body: { title, subTitle, imageUrl, currentBid, roomNo },
      session: { userId },
    } = req;
    const profile = await req.profile();
    var rooms = profile.rooms;
    if (!rooms) {
      rooms = [];
    }

    const roomIndex = rooms.findIndex((s) => s.roomNo == roomNo);
    if (roomIndex != -1) {
      // comment below
      return successResponse({ res, response: { profile } });
      // uncomment below
      // return errorResponse({ res, err: "Room is already available." });
    }

    rooms.push({
      roomNo: roomNo,
      title: title,
      subTitle: subTitle,
      currentBid: currentBid,
      imageUrl: imageUrl,
      active: rooms.length == 0 ? true: false,
      modelAssets: {},
      nftStates: [],
    });

    await UserModel.updateOne(
      { _id: userId },
      {
        rooms: rooms,
      }
    );

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
