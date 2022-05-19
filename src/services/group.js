const { default: DaoModel } = require("../modules/DAO/model");

class GroupService {
  groupModel = [];

  async create() {
    const daos = await DaoModel.find();
    for(var i = 0; i < daos.length; i ++) {
      this.groupModel.push({
        id: daos[i]._id,
        name: daos[i].name,
        msgs: [],
      });
    }
  }

  setMsg(msg) {
    const groupIndex = this.groupModel.findIndex(s => s.id == msg.daoId);
    if(groupIndex > -1) {
      this.groupModel[groupIndex].msgs.push(msg);
    }
  }

  getGroupMsgs(daoId) {
    const groupIndex = this.groupModel.findIndex(s => s.id == daoId);
    if(groupIndex > -1) {
      return this.groupModel[groupIndex].msgs;
    }
    return [];
  }
}

module.exports = new GroupService();
