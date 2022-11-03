import { errorResponse, successResponse, throwError } from "../../../utils";
import ChatModel from '../model';

export const fetchMessagesController = async (req, res) => {
  try {
    const {
      body: { members },
      session: { userId }
    } = req;

    const data = await ChatModel.findOne({ 
      users: { $all: members, $size: members.length },
    });
    if(!!data) {
      for(var i = 0; i < data.msgs.length; i ++) {
        if(data.msgs[i].sender == userId && data.msgs[i].readState == false) {
          break;
        }
      }
      if(i == data.msgs.length) {
        await ChatModel.update(
          { users: { $all: members, $size: members.length } },
          { $set: { "msgs.$[].readState": true } }
        );
      }
  
      const chat = await ChatModel.findOne({users: {$all: members, $size: members.length}}).populate('msgs.sender');
      return successResponse({ res, response: { chat } });
    } else {
      return successResponse({ res, response: { chat: [] } });
    }

  } catch (err) {
    return errorResponse({ res, err });
  }
};
