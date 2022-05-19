import axios from "axios";
import { throwError } from "./index";

export const getCollectionStats = async (symbol) => {
  try {
    let result = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`
    );
    return result.data;
  } catch (err) {
    throwError("A collection with this name doesn't exist");
  }
};

export const getAllNftsOwned = async (walletAddress) => {
  try {
    let result = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?offset=0&limit=500&listStatus=both`
    );
    return result.data;
  } catch (err) {
    return [];
  }
};
