const { default: UserModel } = require("../modules/User/model");

class UserService {
    userModel = [];

    createUser(data) {
        const { name, socket } = data;
        var userId = this.userModel.length;
        var newUser = { 
            socket: socket,
            user: {
                userId: userId,
                name: name,
                msgs: [],
                onlineFlag: true,
            }
        };
        this.userModel.push(newUser);
        return newUser;
    }

    joinUser({userIndex, socket}) {
        if(!!this.userModel[userIndex]) {
            this.userModel[userIndex].user.onlineFlag = true;
            this.userModel[userIndex].socket = socket;
            return this.userModel[userIndex];
        }
        return {};
    }

    getOnlineUser(name) {
        var users = [];
        for(var i = 0; i < this.userModel.length; i ++) {
            if(this.userModel[i].user.onlineFlag)
            users.push(this.userModel[i].user);
        }
        return users;
    }
}

module.exports = new UserService();
