import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";
import userService from "../../../services/user";

export const fetchUsersToInviteController = async (req, res) => {
  try {
    const {
      body: { searchName },
      session: { userId },
    } = req;
    var users = [];

    const userInfo = await UserModel.findById(userId);
    const friends = !!userInfo.friends ? userInfo.friends: [];
    // Fetch matched users from User model
    const userData = await UserModel.find(
      {
        username: { $regex: searchName }
      }, 
      {
        username: 1, 
        "profileImage.link": 1, 
        createdAt: 1, 
        bio: 1,
        solanaAddress: 1
      }
    ).sort('createdAt');

    // Add onlineFlag in fetched users
    for (var i = 0; i < userData.length; i ++) {
      for(var j = 0; j < friends.length; j ++) {
        if(friends[j].friend && friends[j].friend.username == userData[i].username) {
          return;
        }
      }
      if((friends.length == 0 || j == friends.length) && userData[i]._id != userId) {
        users.push({
          _id: userData[i]._id,
          username: userData[i].username,
          bio: userData[i].bio,
          profileImage: userData[i].profileImage.link,
          solanaAddress: userData[i].solanaAddress,
          createdAt: userData[i].createdAt,
          onlineFlag: userService.getOnlineUser(userData[i].username)
        })
      }
    }

    return successResponse({ res, response: { users } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
