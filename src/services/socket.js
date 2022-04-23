import ACTIONS from './config/actions';
import roomService from './room';
import User from '../modules/User/model';
export const socketService = (io) => {
  const socketUserMapping = {}
  var roomIndex = 0;
  //aframe
  const rooms = {};
  const userlist = {};
  ////////////
  io.on('connection', (socket) => {

    //aframe
    let curRoom = null;
    socket.on("send", data => {
      if(!!socket.username) {
          data['name'] = socket.username;
      }
      io.to(data.to).emit("send", data);
    });
    

    socket.on("broadcast", data => {
      if(!!socket.username) {
          data['name'] = socket.username;
      }
      socket.to(curRoom).emit("broadcast", data);
    });

    /////////////////////////////////////

    console.log('new connection', socket.id);
    socket.socket_id = socket.id;
    socket.on(ACTIONS.SET_USER_NAME, ({username}) => {
        userlist[username] = socket;
    })

    socket.on(ACTIONS.JOIN, async ({ roomId, user }) => {
        try {
            const { modelIndex, name, roomName } = user;
            socketUserMapping[socket.id] = user;
            if(roomId == -1) {
                roomId = roomService.create(roomIndex, {name: name, modelIndex, roomName, sid: socket.id});
                socket.emit(ACTIONS.ROOM_READY, {roomId});
                roomIndex ++;
                return;
            } else {
                roomService.joinRoom(roomId, {name: name, modelIndex, sid: socket.id});
            }

            ////////////////////- Aframe Content -////////////////////
            curRoom = 'room' + roomId;
            if (!rooms[curRoom]) {
                rooms[curRoom] = {
                    occupants: {},
                };
            }
        
            const joinedTime = Date.now();
            rooms[curRoom].occupants[socket.id] = {
                joinedTime,
                modelIndex,
            };
            socket.emit("connectSuccess", { joinedTime, curRoom });
            const occupants = rooms[curRoom].occupants;
            /////////////////////////////////////////////////////////

            socket.username = user.name;
            socket.modelIndex = modelIndex;
            socket.roomId = roomId;
            socket.roomName = roomName;

            const room = await roomService.getRoom(roomId);
            if(!!room) {
                socket.emit(ACTIONS.CREATE_ROOM, {roomId, msgs: room.msgs});
                io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});

                var clients= room.clients.filter(s => s != socket.id) || [];
                clients.forEach(clientId => {
                    io.to(clientId).emit(ACTIONS.ADD_PEER, {
                        peerId: socket.id,
                        createOffer: false,
                        user
                    });

                    socket.emit(ACTIONS.ADD_PEER, {
                        peerId: clientId,
                        createOffer: true,
                        user: socketUserMapping[clientId]
                    });
                });

                socket.join('room' + roomId);
                io.in(curRoom).emit("occupantsChanged", { occupants });
                console.log(`${socket.id} joined in room ${roomId}`);
            }
        } catch(err) {console.log(err)}
    });

    socket.on(ACTIONS.GET_USERS, () => {
        try {
            User.find()
                .then((users, err) => {
                    if(err) {
                        console.log('User Error', err);
                        return;
                    }
                    socket.emit(ACTIONS.GET_USERS, users);
                })
        } catch (error) {
            console.log('GET_USERS', error);
        }
    })

    socket.on(ACTIONS.ROOM_LIST, () => {
        io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});
    })

    socket.on(ACTIONS.INVITE_FRIEND, async (data) => {
        try {
            let { username, roomId, invitor } = data;
            let user = await User.findOne({username: username});
            if(!!user.invitations) {
                for (var i = 0; i < user.invitations.length; i ++) {
                    if(user.invitations[i].roomId == roomId) {
                        socket.emit(ACTIONS.DUPLICATION_INVITATION, {});
                        return;
                    }
                }
            }
            let invitations = !!user.invitations ? user.invitations: [];
            let link = user.publicAddress.slice(5, 10) + roomId + user.createdAt.toString().slice(20, 21);
            let roomName = await roomService.inviteFriend(username, roomId, link);
            invitations.push({
                name: username,
                invitor: invitor,
                roomId: roomId,
                roomName: roomName,
                link: link,
                state: false,
            })
            user.invitations = invitations;
            user.save();
            io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});
        } catch (error) {
            console.log("Invite Friend: ", error);
        }
    })

    socket.on(ACTIONS.ACEEPT_INVITATION, async (data) => {
        let { roomId, username, guestname, type } = data;
        await roomService.completeInvitation(roomId, username, guestname, type);
    })

    socket.on(ACTIONS.GET_INVITATIONS, ({username}) => {
        try {
            User.findOne({username: username})
                .then(async (user) => {
                    if(user) {
                        try {
                            var invitations = [];
                            for (let index = 0; index < user.invitations.length; index++) {
                                const invitation = user.invitations[index];
                                if(invitation.state == false) {
                                    let room = await roomService.getRoom(invitation.roomId);
                                    if(!!room) {
                                        invitations.push(invitation);
                                    } else {
                                        user.Invitations[index].state = true;
                                    }
                                }   
                            }
                            user.save();
                            socket.emit(ACTIONS.GET_INVITATIONS, {invitations});
                        } catch (error) {
                            console.log('User', error);
                        }
                    }
                })
        } catch (error) {
            console.log('get invitations: ', error);
        }
    })

    socket.on(ACTIONS.SEND_MSG, ({roomId, data}) => {
        io.to('room' + roomId).emit(ACTIONS.SEND_MSG, {user: socket.username, msg: data});
        roomService.addMsg(roomId, {user: socket.username, msg: data});
    })

    // handel relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, iceCandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            iceCandidate
        })
    })

    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        })
    })

    // mute or unmute the user
    socket.on(ACTIONS.MUTE, ({ roomId, name }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id,
                name
            })
        })
    })

    socket.on(ACTIONS.UNMUTE, ({ roomId, name }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id,
                name
            })
        })
    })

    // leaving the room 
    const leaveRoomFunc = async ({roomId, user}) => {
        try {
            //////////////////////- Aframe -////////////////////////
            if (rooms[curRoom]) {
                console.log("user disconnected", socket.id);
        
                delete rooms[curRoom].occupants[socket.id];
                const occupants = rooms[curRoom].occupants;
                socket.to(curRoom).emit("occupantsChanged", { occupants });
        
                if (Object.keys(occupants).length === 0) {
                console.log("everybody left room");
                delete rooms[curRoom];
                }
            }
            ////////////////////////////////////////////////////////

            var room = await roomService.getRoom(roomId);
            if(!!room) {
                var clients = room.clients.filter(s => s != socket.id);
                
                clients.forEach((clientId) => {
                    io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                        peerId: socket.id,
                        name: user.name,
                        user
                    })
                })
                socket.leave('room' + roomId);
                socket.roomId = -1;
                
                roomService.leaveRoom(roomId, {name: user.name, sid: socket.id});
                io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});
                delete userlist[user.name];
                delete socketUserMapping[socket.id];
            }
        } catch(err) {console.log('leave', err)}
    };

    socket.on(ACTIONS.LEAVE, leaveRoomFunc)
    socket.on('disconnect', () => {
        leaveRoomFunc({roomId: socket.roomId, user: {name: socket.username}});
        console.log('disconnection ' + socket.socket_id);
    })
  });
};