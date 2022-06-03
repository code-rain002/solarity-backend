import md5 from "md5";
import User from "../modules/User/model";
const roomModel = [];

class RoomService {
    
    async create(roomId, payload) {
        try {
            const { name, sid, roomName, modelIndex, title, type, roomNo } = payload;
            roomModel.push({
                invitationHash: md5(roomName + roomId),
                roomId,
                roomName,
                name,
                title,
                type,
                roomNo,
                sid,
                modelIndex,
                clients: [],
                speakers: [],
                states: [],
                links: [],
                models: [],
                guests: [],
                msgs: [],
            });
            return roomId;
        } catch (error) {
            console.log(error);
        }
    }

    getAllRooms(types) {
        return roomModel;
    }

    async getRoom(roomId) {
        const room = await roomModel.find(s => s.roomId == roomId);
        return room;
    }

    async getRoomWithHash(invitationHash) {
        const room = await roomModel.find(s => s.invitationHash == invitationHash);
        return room;
    }

    async joinRoom(roomId, user) {
        var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
        if(!!roomModel[roomIndex]) {
            roomModel[roomIndex].speakers.push(user.name);
            roomModel[roomIndex].clients.push(user.sid);
            roomModel[roomIndex].models.push(user.modelIndex);
        }
    }

    async leaveRoom(roomId, user) {
        var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
        if(roomIndex !== -1 && !!roomModel[roomIndex]) {
            var clientIndex = roomModel[roomIndex].speakers.findIndex(s => s == user.name);
            if(clientIndex == -1) {
                return;
            }

            roomModel[roomIndex].speakers.splice(clientIndex, 1);
            roomModel[roomIndex].clients.splice(clientIndex, 1);
            roomModel[roomIndex].models.splice(clientIndex, 1);
            var guestIndex = roomModel[roomIndex].guests.findIndex(s => s.guestname == user.name)
            if(guestIndex != -1) {
                roomModel[roomIndex].guests.splice(guestIndex, -1);
            }
            if(roomModel[roomIndex].clients.length == 0) {
                if(roomModel[roomIndex].states.length != 0) {
                    roomModel[roomIndex].states.map(async (state) => {
                        let user = await User.findOne({username: state});
                        if(!!user) {
                            let invitations = user.invitations;
                            if(!!invitations) {
                                let invitationIndexList = [];
                                for(var i = 0; i < invitations.length; i ++) {
                                    if(invitations[i].roomId == roomId && invitations[i].state == false) {
                                        invitationIndexList.push(i);
                                    }
                                }
                                if(invitationIndexList.length != 0) {
                                    for(var j = 0; j < invitationIndexList.length; j ++) {
                                        user.invitations[invitationIndexList[j]].state = true;
                                    }
                                    user.save();
                                }
                            }
                        }
                    })
                }
                roomModel.splice(roomIndex, 1);
                return;
            }
        }
    }

    async addMsg (roomId, msg) {
        var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
        if(roomIndex != -1) {
            roomModel[roomIndex].msgs.push(msg);
        }
    }

    async inviteFriend (username, roomId, link) {
        var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
        if(roomIndex != -1) {
            roomModel[roomIndex].states.push(username);
            roomModel[roomIndex].links.push(link);
            return roomModel[roomIndex].roomName;
        }
        return '';
    }

    async completeInvitation (roomId, username, guestname, type) {
        try {
            var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
            if(roomIndex != -1) {
                if(type) {
                    roomModel[roomIndex].guests.push({ guestname: guestname, username: username });
                }
                var stateIndex = roomModel[roomIndex].states.findIndex(s => s == username);
                if(stateIndex > -1) {
                    roomModel[roomIndex].states.splice(stateIndex, -1); 
                    roomModel[roomIndex].links.splice(stateIndex, -1); 
                }
            }
        } catch (error) {
            console.log('completeInvitation', error);
        }
    }

}
module.exports = new RoomService();
