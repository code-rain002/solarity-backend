import { errorResponse, successResponse, throwError } from "../../../utils";
import roomService from "../../../services/room";
export const getRoomIdsController = async (req, res) => {
  try {
    const {
    } = req;

    const rooms = await roomService.getAllRooms();
    const roomIds = rooms.map((room) => { return room.invitationHash;});
    return successResponse({ res, response: { roomIds } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
