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
  console.log(username);
  const twitterData = await twitterApi.v2.userByUsername(username);
  console.log(twitterData);
  if (twitterData.errors) throwError("Invalid twitter username");
  return twitterData;
};

export const getProfileData = async (req) => {
  const { userId } = req.session;
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
