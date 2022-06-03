import { errorResponse, successResponse, throwError } from "../../../utils";
import roomService from "../../../services/room";
export const getLinkInfoController = async (req, res) => {
  try {
    const {
      params: { link },
    } = req;

    const roomInfo = await roomService.getRoomWithHash(link);
    if (roomInfo) {
      return successResponse({ res, response: { roomInfo } });
    }

    return errorResponse({ res, err: "" });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
