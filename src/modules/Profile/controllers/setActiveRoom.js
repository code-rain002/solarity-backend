import { successResponse, errorResponse } from "../../../helpers";
import UserModel from "../../User/model";

export const setActiveRoomController = async (req, res) => {
  try {
    const {
      body: {
          roomNo,
      },
      session: { userId },
    } = req;
    const profile = await req.profile();
    var rooms = profile.rooms;
    if(!rooms) {
      rooms = [];
    }
    for(var i = 0; i < rooms.length; i ++) {
        rooms[i].active = false;
    }
    const roomIndex = rooms.findIndex(s => s.roomNo == roomNo);
    if(roomIndex != -1) {
        rooms[roomIndex].active = true;
    }

    await UserModel.updateOne(
        { _id: userId },
        {
          rooms: rooms,
        }
      );

  } catch (err) {
    return errorResponse({ res, err });
  }
};
