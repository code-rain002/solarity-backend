import { throwError } from "../../helpers";
import UserModel from "../User/model";

const VALIDATE_TWITTER = false;

export const validateTwitterUsername = async (req, username) => {
  const { userId } = req.session;
  const twitterApi = req.app.get("twitterApi");
  if (VALIDATE_TWITTER) {
    const timeline = await twitterApi.v1.userTimelineByUsername(username, {
      count: 5,
    });
    const { _realData } = timeline;
    const data = _realData.map(({ full_text }) => full_text.trim());
    if (!data.includes(userId)) {
      throwError("Unable to verify twitter account ownership");
    }
  }
  return await twitterApi.v2.userByUsername(username);
};

export const getProfileData = async (userId) => {
  const user = await UserModel.findById(userId, {
    password: 0,
    followers: 0,
    createdAt: 0,
    updatedAt: 0,
    following: 0,
    __v: 0,
  });
  return user;
};
