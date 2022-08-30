import { errorResponse, successResponse } from "../../../utils";
import UserModel from "../model";
import userService from "../../../services/user";

export const fetchUsersToInviteController = async (req, res) => {
  try {
    const {
      params: { searchName },
    } = req;
    var users = [];
    // Fetch matched users from User model
    const userData = await UserModel.find(
      {
        username: { $regex: searchName }
      }, 
      {
        username: 1, 
        profileImage: 1, 
        createdAt: 1, 
        solanaAddress: 1
      }
    ).sort('createdAt');

    // Add onlineFlag in fetched users
    for (var i = 0; i < userData.length; i ++) {
      users.push({
        _id: userData[i]._id,
        username: userData[i].username,
        solanaAddress: userData[i].solanaAddress,
        createdAt: userData[i].createdAt,
        onlineFlag: userService.getOnlineUser(userData[i].username)
      })
    }

    return successResponse({ res, response: { users } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
