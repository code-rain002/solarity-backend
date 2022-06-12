import CollectionModel from "../../Collection/model";
import { getOwnedNfts } from "../../NFT/helpers";
import DaoModel from "../model";

export const getDaoMemberships = async (walletAddress) => {
  // get all the nfts owned by the wallet
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
  return memberDaos.map(({ _id }) => _id);
};
