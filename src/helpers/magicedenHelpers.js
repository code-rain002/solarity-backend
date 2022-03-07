import axios from "axios";
import { NftCollectionModel, NftModel } from "../modules/NFT/model";
import { promiseWhile } from "./generalHelpers";
import Promise from "bluebird";
import { throwError } from "./responseHelpers";

export const getNftCollectionStats = async (symbol) => {
  try {
    let result = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`
    );
    result.data.loaded = false;
    await NftCollectionModel.create(result.data);
    return result.data;
  } catch (err) {
    throwError("A collection with this name doesn't exist");
  }
};

export const fetchAllNftInCollection = async (symbol) => {
  try {
    const collection = await NftCollectionModel.findOne({ symbol });
    const { loaded } = collection;
    if (loaded) return true;
    let continueFetching = true;
    let offset = 0;
    let limit = 20;
    await promiseWhile(
      () => continueFetching,
      async () => {
        const result = await axios.get(
          `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${offset}&limit=${limit}`
        );
        result.data.forEach((nft) => {
          nft.listingUrl = `https://api.all.art/v1/solana/${nft.tokenMint}`;
        });
        const listingDetailPromises = result.data.map(({ listingUrl }) =>
          axios.get(listingUrl)
        );
        let nfts = await Promise.allSettled(listingDetailPromises);
        nfts = nfts
          .filter(({ _settledValueField: { status } }) => status == 200)
          .map(({ _settledValueField: { data } }) => data);
        nfts.forEach((nft) => {
          const data = result.data.find((d) => d.tokenMint == nft.Mint);
          data.listing = nft;
        });
        await NftModel.bulkWrite(
          result.data.map((nft) => ({
            updateOne: {
              filter: { tokenMint: nft.tokenMint },
              update: { $set: { ...nft, symbol } },
              upsert: true,
            },
          }))
        );
        if (result.data.length == 0) {
          continueFetching = false;
        }
        offset += limit;
      }
    );
    await NftCollectionModel.updateOne({ symbol }, { loaded: true });
    console.log("I have fetched the nfts for " + symbol);
  } catch (err) {
    console.log(err);
  }
};

export const getAllNftsInCollection = async (symbol) => {
  try {
    let continueFetching = true;
    let offset = 0;
    let limit = 20;
    let data = [];
    await promiseWhile(
      () => continueFetching,
      async () => {
        const result = await axios.get(
          `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${offset}&limit=${limit}`
        );
        result.data.forEach((nft) => {
          nft.listingUrl = `https://api.all.art/v1/solana/${nft.tokenMint}`;
        });
        const listingDetailPromises = result.data.map(({ listingUrl }) =>
          axios.get(listingUrl)
        );
        let nfts = await Promise.allSettled(listingDetailPromises);
        nfts = nfts
          .filter(({ _settledValueField: { status } }) => status == 200)
          .map(({ _settledValueField: { data } }) => data);
        data = [...data, ...result.data];
        if (result.data.length == 0) {
          continueFetching = false;
        }
        offset += limit;
      }
    );
    await NftModel.bulkWrite(
      data.map((nft) => ({
        updateOne: {
          filter: { tokenMint: nft.tokenMint },
          update: { $set: { ...nft, symbol } },
          upsert: true,
        },
      }))
    );
    return data.length;
  } catch (err) {
    console.log(err);
    return false;
  }
};
