import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Connection, PublicKey } from "@solana/web3.js";

export const getOwnedNfts = async (publicAddress, onlyAddresses = false) => {
  const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT);
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress,
    connection,
  });
  if (onlyAddresses) {
    return nfts.map(({ mint }) => mint);
  }
  return nfts;
};
