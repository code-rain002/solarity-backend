import { successResponse, errorResponse } from "../../../helpers";
import UserModel from "../../User/model";

export const buyRoomController = async (req, res) => {
  try {
    const {
      body: {
          title,
          subTitle,
          imageUrl,
          currentBid,
      },
      session: { userId },
    } = req;
    const profile = await req.profile();
    var rooms = profile.rooms;
    if(!rooms) {
      rooms = [];
    }
    rooms.push({
        title: title,
        subTitle: subTitle,
        currentBid: currentBid,
        imageUrl: imageUrl,
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
