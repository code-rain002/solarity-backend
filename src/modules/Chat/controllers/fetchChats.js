import { errorResponse, successResponse, throwError } from "../../../utils";
import ChatModel from '../model';

export const fetchChatsController = async (req, res) => {
  try {
    const {
      session: { userId }
    } = req;

    var chats = await ChatModel.find({"users": {$all: [userId]}}).populate('users');

    var tmpChats = [];
    for(var j = 0; j < chats.length; j ++) {
      var chat = chats[j];
      var unreadCount = 0;
      for(var i = 0; i < chat.msgs.length; i ++) {
        if(chat.msgs[chat.msgs.length - 1 - i].readState == false) {
          unreadCount ++;
        } else {
          break;
        }
      }
      tmpChats.push({
        _id: chat._id,
        users: chat.users,
        blockState: chat.blockState,
        type: chat.type,
        unreadCount,
        lastMsg: chat.msgs[chat.msgs.length - 1]
      })
    }

    return successResponse({ res, response: { chats: tmpChats } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
