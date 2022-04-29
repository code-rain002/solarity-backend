import { successResponse, errorResponse } from "../../../helpers";
import UserModel from "../../User/model";

export const checkRoomController = async (req, res) => {
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

    const roomIndex = rooms.findIndex(s => s.roomNo == roomNo);
    if(roomIndex != -1) {
        return successResponse({ res, response: { state: true } });
    } else {
        return successResponse({ res, response: { state: false } });
    }

  } catch (err) {
    return errorResponse({ res, err });
  }
};
