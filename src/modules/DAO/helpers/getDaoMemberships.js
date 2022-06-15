import CollectionModel from "../../Collection/model";
import { getOwnedNfts } from "../../NFT/helpers";
import UserModel from "../../User/model";
import DaoModel from "../model";

export const getDaoMemberships = async ({ walletAddress, set, useCache }) => {
  if (useCache) {
    const data = await UserModel.findOne(
      { solanaAddress: walletAddress },
      { daoMemberships: 1 }
    );
    if (data.daoMemberships) {
      const { checked, daoIds } = data.daoMemberships;
      if (checked) return daoIds;
    }
  }
  const ownedNfts = await getOwnedNfts(walletAddress, true);
  const ownedCollections = await CollectionModel.find(
    {
      nfts: { $in: ownedNfts },
    },
    { _id: 1 }
  );
  const memberDaos = await DaoModel.find(
    {
      "collections.collectionId": { $in: ownedCollections },
    },
    {
      _id: 1,
    }
  );
  if (set) {
    await UserModel.updateOne(
      { solanaAddress: walletAddress },
      {
        daoMemberships: {
          checked: true,
          daoIds: memberDaos,
        },
      }
    );
  }
  return memberDaos.map(({ _id }) => _id);
};
