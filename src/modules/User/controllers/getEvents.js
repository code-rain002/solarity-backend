import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";

export const getEventsController = async (req, res) => {
  try {
    // const data = await UserModel.find();
    return successResponse({ res, response: { success: "success" } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
