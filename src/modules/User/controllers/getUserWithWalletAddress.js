import { errorResponse, successResponse, throwError } from "../../../utils";
import UserModel from "../model";
import { userAddFields, userUnsetFields } from "../shared";

export const getUserWithWalletAddressController = async (req, res) => {
  try {
    const {
      params: { address: address },
    } = req;
    const user = await UserModel.aggregate([
      {
        $match: {
          $or: [{ solanaAddress: address }, { ethereumAddress: address }],
        },
      },
      {
        $addFields: userAddFields,
      },
      { $unset: userUnsetFields },
    ]);
    if (user.length == 0) throwError("No user with the current wallet exists");
    return successResponse({ res, response: { user: user[0] } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
