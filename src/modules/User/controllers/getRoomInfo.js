import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";

export const getRoomInfoController = async (req, res) => {
  try {
    const {
      params: { name: name, roomNo: roomNo },
    } = req;

    const user = await UserModel.findOne({
      username: name,
      "rooms.roomNo": roomNo,
    });
    const roomInfoData = user.rooms.find((s) => s.roomNo == roomNo);
    return successResponse({ res, response: { roomInfoData } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
