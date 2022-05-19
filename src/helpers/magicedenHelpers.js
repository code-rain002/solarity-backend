import axios from "axios";
// import NftCollectionModel from "../modules/NFTCollections/model";
import { NftModel } from "../modules/NFT/model";
import { promiseWhile } from "./generalHelpers";
import Promise from "bluebird";
import { throwError } from "./responseHelpers";

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

export const getNftCollectionStats = async (symbol) => {
  try {
    let result = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`
    );
    return result.data;
  } catch (err) {
    throwError("A collection with this name doesn't exist");
  }
};

export const getSolanaNftDetails = async (mintAddress) => {
  let result = await axios.get(
    `https://api-mainnet.magiceden.dev/v2/tokens/${mintAddress}`
  );
  return result.data;
};

// export const fetchAllNftInCollection = async (symbol) => {
//   try {
//     const collection = await NftCollectionModel.findOne({ symbol });
//     const { loaded } = collection;
//     if (loaded) return true;
//     let continueFetching = true;
//     let offset = 0;
//     let limit = 20;
//     await promiseWhile(
//       () => continueFetching,
//       async () => {
//         const result = await axios.get(
//           `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${offset}&limit=${limit}`
//         );
//         result.data.forEach((nft) => {
//           nft.listingUrl = `https://api.all.art/v1/solana/${nft.tokenMint}`;
//         });
//         const listingDetailPromises = result.data.map(({ listingUrl }) =>
//           axios.get(listingUrl)
//         );
//         let nfts = await Promise.allSettled(listingDetailPromises);

//         nfts = nfts
//           .filter(({ _settledValueField: { status } }) => status == 200)
//           .map(({ _settledValueField: { data } }) => data);

//         nfts.forEach((nft) => {
//           const data = result.data.find((d) => d.tokenMint == nft.Mint);
//           data.listing = nft;
//         });
//         await Promise.each(result.data, async (_result) => {
//           const {
//             seller,
//             price,
//             listingUrl,
//             tokenAddress,
//             pdaAddress,
//             tokenSize,
//             listing: {
//               Mint,
//               Items,
//               Creators,
//               Description,
//               Preview_URL,
//               Title,
//               tags,
//               nsfw,
//               jsonUrl,
//               Pubkey,
//               Properties,
//             },
//           } = _result;

//           await NftModel.updateOne(
//             { mint: Mint },
//             {
//               symbol,
//               items: Items,
//               creators: Creators,
//               description: Description,
//               preview_URL: Preview_URL,
//               title: Title,
//               tags,
//               nsfw,
//               jsonUrl,
//               pubkey: Pubkey,
//               properties: Properties,
//               seller,
//               price,
//               listingUrl,
//               tokenAddress,
//               pdaAddress,
//               tokenSize,
//             },
//             { upsert: true }
//           );
//         });

//         continueFetching = false;
//         if (result.data.length == 0) {
//           continueFetching = false;
//         }
//         offset += limit;
//       }
//     );
//     await NftCollectionModel.updateOne({ symbol }, { loaded2: true });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const getAllNftsInCollection = async (symbol) => {
//   try {
//     let continueFetching = true;
//     let offset = 0;
//     let limit = 20;
//     let data = [];
//     await promiseWhile(
//       () => continueFetching,
//       async () => {
//         const result = await axios.get(
//           `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${offset}&limit=${limit}`
//         );
//         result.data.forEach((nft) => {
//           nft.listingUrl = `https://api.all.art/v1/solana/${nft.tokenMint}`;
//         });
//         const listingDetailPromises = result.data.map(({ listingUrl }) =>
//           axios.get(listingUrl)
//         );
//         let nfts = await Promise.allSettled(listingDetailPromises);
//         nfts = nfts
//           .filter(({ _settledValueField: { status } }) => status == 200)
//           .map(({ _settledValueField: { data } }) => data);
//         data = [...data, ...result.data];
//         if (result.data.length == 0) {
//           continueFetching = false;
//         }
//         offset += limit;
//       }
//     );
//     await NftModel.bulkWrite(
//       data.map((nft) => ({
//         updateOne: {
//           filter: { tokenMint: nft.tokenMint },
//           update: { $set: { ...nft, symbol } },
//           upsert: true,
//         },
//       }))
//     );
//     return data.length;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };
