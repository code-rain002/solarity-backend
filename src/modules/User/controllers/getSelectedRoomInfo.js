import { errorResponse, successResponse } from "../../../utils";
import roomService from "../../../services/room";

export const getSelectedRoomInfoController = async (req, res) => {
  try {
    const {
      params: { roomNo: roomNo },
    } = req;

    var selectedRoomInfo = await roomService.getRoom(roomNo);

    return successResponse({ res, response: { selectedRoomInfo } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
