import {
  successResponse,
  errorResponse,
  throwError,
  verifySignature,
} from "../../../utils";
import UserModel from "../../User/model";
import _ from "lodash";
import { isValidSolanaAddress } from "@nfteyez/sol-rayz";

// OK
export const updatePublicAddressController = async (req, res) => {
  try {
    const {
      session: { userId },
      body: { publicAddress, signedUserId },
    } = req;

    // Validate if the public address is valid
    if (!isValidSolanaAddress(publicAddress)) {
      throw false;
    }

    // verify the signature
    const verified = verifySignature(userId, signedUserId, publicAddress);
    if (!verified) throwError("Invalid signature");

    await UserModel.updateOne({ _id: userId }, { publicAddress });
    return successResponse({ res });
  } catch (err) {
    return errorResponse({
      res,
      err,
      message: "Unable to verify the public address",
    });
  }
};
