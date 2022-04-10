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

}
module.exports = new RoomService();
