import UserModel from "../../modules/User/model";
import { Promise } from "bluebird";
import { getDaoMemberships } from "../../modules/DAO/helpers";

const setDaoMemberships = async () => {
  try {
    const users = await UserModel.find(
      { solanaAddress: { $ne: null } },
      { _id: 1, solanaAddress: 1 }
    );
    await Promise.each(users, async ({ solanaAddress }) => {
      await getDaoMemberships({ walletAddress: solanaAddress, set: true });
    });
  } catch {}
};

export default setDaoMemberships;
