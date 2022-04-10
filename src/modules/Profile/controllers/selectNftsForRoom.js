import { successResponse, errorResponse } from "../../../helpers";
import UserModel from "../../User/model";

export const selectNftsForRoomController = async (req, res) => {
  try {
    const {
      body: { 
        roomId,
        picNo,
        mintAddress,
        link, 
      },
      session: { userId },
    } = req;
    const profile = await req.profile();
    const rooms = profile.rooms;
    if(!rooms) {
      return;
    }
    let roomIndex = rooms.findIndex(s => s.roomId == "62440237e3a684a5c4271457");
    if(roomIndex == -1) {
      rooms.push({
        roomId: "62440237e3a684a5c4271457",
        nftCount: 5,
        nftStates: [],
      });
      roomIndex = 0;
    }
    let picIndex = rooms[roomIndex].nftStates.findIndex(s => s.no == picNo);
    if(picIndex > -1) {
      rooms[roomIndex].nftStates[picIndex] = {
        no: picNo,
        nftAddress: mintAddress,
        link: link,
      }
    } else {
      rooms[roomIndex].nftStates.push({
        no: picNo,
        nftAddress: mintAddress,
        link: link,
      })
    }
    await UserModel.updateOne(
      { _id: userId },
      {
        rooms: rooms,
      }
    );

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
