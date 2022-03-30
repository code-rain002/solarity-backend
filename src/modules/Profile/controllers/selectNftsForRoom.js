import { successResponse, errorResponse } from "../../../helpers";

export const selectNftsForRoomController = async (req, res) => {
  try {
    return successResponse({ res });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
