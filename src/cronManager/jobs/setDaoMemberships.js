import UserModel from "../../modules/User/model";
import { Promise } from "bluebird";
import { getDaoMemberships } from "../../modules/DAO/helpers";
import mongoose from "mongoose";

const setDaoMemberships = async () => {
  try {
    console.log("STEP 1");
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log("STEP 2");
    const db = mongoose.connection;
    console.log("STEP 3");

    db.once("open", async () => {
      console.log("STEP 4");
      const users = await UserModel.find(
        { solanaAddress: { $ne: null } },
        { _id: 1, solanaAddress: 1 }
      );
      await Promise.each(users, async ({ solanaAddress }) => {
        await getDaoMemberships({ walletAddress: solanaAddress, set: true });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export default setDaoMemberships;
