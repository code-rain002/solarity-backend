import { getCollectionsOwned } from "../../../helpers";
import UserModel from "../../User/model";

export * from "./getDaos";
export * from "./getSingleDao";
export * from "./getDaoFollowingStatus";
export * from "./followDao";
export * from "./unfollowDao";

export const getMemberDaos = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.find({ username });
    const ownedCollections = await getCollectionsOwned(user.publicAddress);
    return successResponse({ res, response: { ownedCollections } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
