import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";
import { userAddFields, userUnsetFields } from "../shared";

export const getUsersController = async (req, res) => {
  try {
    const {
      query: { term = "" },
    } = req;

    let searchTerm = new RegExp(term.toLowerCase(), "i");
    const data = await UserModel.aggregate([
      {
        $match: {
          visible: true,
        },
      },
      {
        $match: {
          $or: [
            { username: searchTerm },
            { email: searchTerm },
            { fullName: searchTerm },
          ],
        },
      },
      {
        $addFields: userAddFields,
      },
      {
        $unset: userUnsetFields,
      },
    ]);

    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
