import { errorResponse, successResponse, throwError } from "../../../helpers";
import UserModel from "../model";

export const getLinkInfoController = async (req, res) => {
  try {
    const {
      params: { link },
    } = req;

    let user = await UserModel.findOne({"invitations.link": link});
    if(user) {
      let invitation = user.invitations.find(s => s.link == link);
      if(invitation) {
        return successResponse({ res, response: { invitation } });
      }
    }
    
    return errorResponse({ res, err: "" });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
