const { default: UserModel } = require("../modules/User/model");

class UserService {
    userModel = [];

    async createUser(data) {
        const { name, socket } = data;
        const user = await UserModel.findOne({username: name});
        var userNo = this.userModel.length;
        var newUser = { 
            socket: socket,
            user: {
                userId: user._id,
                userNo: userNo,
                name: name,
                friends: user.friends,
                onlineFlag: true,
            }
        };
        this.userModel.push(newUser);
        return newUser;
    }

    getFriendsStatus({ userInfo }) {
        var friends = [];
        if(!!userInfo && !!userInfo.user.friends) {
            for(var i = 0; i < userInfo.user.friends.length; i ++) {
                const friend = userInfo.user.friends[i];
                console.log(friend);
                // for(var j = 0; j < this.userModel.length; j ++) {
                //     if(this.userModel[j].user.userId == friend.friendId) {
                //         return;
                //     }
                // }
                // friends.push({
                // });
            }
        }
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
        for(var i = 0; i < this.userModel.length; i ++) {
            if(this.userModel[i].user.onlineFlag && this.userModel[i].user.name == name)
                return true
        }
        return false;
    }
}

module.exports = new UserService();
