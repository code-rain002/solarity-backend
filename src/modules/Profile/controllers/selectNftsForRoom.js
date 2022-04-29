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
    var rooms = profile.rooms;
    if(!rooms) {
      rooms = [];
    }
    let roomIndex = rooms.findIndex(s => s._id == roomId);
    if(roomIndex == -1) {
      rooms.push({
        roomNo: -1,
        title:"default",
        currentBid: 0,
        imageUrl: "",
        active: false,
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
