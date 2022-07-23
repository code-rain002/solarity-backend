import {
  successResponse,
  errorResponse,
  throwError,
  removeWhiteSpaces,
  isProfileVisible,
  domainValidator,
} from "../../../utils";
import UserModel from "../../User/model";

export const updateNftAddressController = async (req, res, next) => {
  try {
    const {
      // session: { userId },
      body: { userId, nftAddress },
    } = req;

    if (!userId && !nftAddress) return next();

    await UserModel.updateOne(
      { _id: userId },
      { passportNftAddress: nftAddress }
    );
    return successResponse({ res, response: { nftAddress: nftAddress } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

