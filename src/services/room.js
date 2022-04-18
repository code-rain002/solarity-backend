import User from "../modules/User/model";
const roomModel = [];

class RoomService {
    
    create(roomId, payload) {
        const { name, sid, roomName, modelIndex } = payload;
        roomModel.push({
            roomId,
            roomName,
            name,
            sid,
            modelIndex,
            clients: [],
            speakers: [],
            states: [],
            links: [],
            models: [],
            msgs: [],
        });
        return roomId;
    }

    getAllRooms(types) {
        return roomModel;
    }

    async getRoom(roomId) {
        const room = await roomModel.find(s => s.roomId == roomId);
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
            if(roomModel[roomIndex].clients.length == 0) {
                if(roomModel[roomIndex].states.length != 0) {
                    roomModel[roomIndex].states.map(async (state) => {
                        let user = await User.findOne({username: state});
                        let invitations = user.invitations;
                        let invitationIndex = invitations.findIndex(s => s.roomId == roomId && s.state == false);
                        if(invitationIndex > -1) {
                            user.invitations[invitationIndex].state = true;
                            user.save();
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

    async completeInvitation (username, roomId) {
        var roomIndex = roomModel.findIndex(s => s.roomId == roomId);
        if(roomIndex != -1) {
            var stateIndex = roomModel[roomIndex].states.findIndex(s => s == username);
            if(stateIndex > -1) {
                roomModel[roomIndex].states.splice(stateIndex, -1); 
                roomModel[roomIndex].links.splice(stateIndex, -1); 
            }
        }
        let user = await User.findOne({username: username});
        let invitations = user.invitations;
        let invitationIndex = invitations.findIndex(s => s.roomId == roomId && s.state == false);
        if(invitationIndex > -1) {
            user.invitations[invitationIndex].state = true;
            user.save();
        }
    }

}
module.exports = new RoomService();
