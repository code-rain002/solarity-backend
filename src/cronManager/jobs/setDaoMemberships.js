import UserModel from "../../modules/User/model";
import { Promise } from "bluebird";
import { getDaoMemberships } from "../../modules/DAO/helpers";
import mongoose from "mongoose";

const setDaoMemberships = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      autoIndex: true,
    });
    await db.once("open");
    const users = await UserModel.find(
      { solanaAddress: { $ne: null } },
      { _id: 1, solanaAddress: 1 }
    );
    await Promise.each(users, async ({ solanaAddress }) => {
      await getDaoMemberships({ walletAddress: solanaAddress, set: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export default setDaoMemberships;
