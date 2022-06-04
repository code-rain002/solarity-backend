import { Connection } from "@solana/web3.js";
import {
  getParsedAccountByMint,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import { Promise } from "bluebird";
import { NftModel } from "../modules/NFT/model";
import { getSolanaNftDetails } from "../helpers";
import { getAllNftsOwned } from "./magicEdenUtils";
import { throwError } from "./responseUtils";

export const saveOwnedNfts = async (publicAddress) => {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT);
    const nfts = await getParsedNftAccountsByOwner({
      publicAddress,
      connection,
      serialization: true,
    });
    // check if nft already in collection
    const nftMintAddresses = nfts.map(({ mint }) => mint);
    const nftFetchAddresses = nftMintAddresses.map(
      (mint) => `https://api.all.art/v1/solana/${mint}`
    );
    const nftDetailPromises = nftFetchAddresses.map(axios.get);
    let nftDetails = await Promise.allSettled(nftDetailPromises);
    const data = nftDetails.map(({ _settledValueField: { data, status } }) => {
      if (!status) return false;
      const {
        Mint,
        Items,
        Creators,
        Description,
        Preview_URL,
        Title,
        tags,
        nsfw,
        jsonUrl,
        Pubkey,
        Properties,
      } = data;
      return {
        mint: Mint,
        items: Items,
        creators: Creators,
        description: Description,
        preview_URL: Preview_URL,
        title: Title,
        tags,
        nsfw,
        jsonUrl,
        pubkey: Pubkey,
        properties: Properties,
        owner: publicAddress,
      };
    });
    await Promise.each(data.filter(Boolean), async (nft) => {
      await NftModel.updateOne({ mint: nft.mint }, nft, { upsert: true });
    });
  } catch (err) {
    throw error;
  }
};

export const checkIfOwnsSolanaNft = async (publicAddress) => {
  const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT);
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress,
    connection,
    sanitize: false,
    serialization: true,
  });
  return Boolean(nfts.length);
};

export const checkIfOwnsEthereumNft = async (publicAddress) => {
  try {
    const {
      data: { ownedNfts },
    } = await axios.get(
      `${process.env.ALCHEMY_HTTP}/getNFTs/?owner=${publicAddress}`
    );
    return ownedNfts > 0;
  } catch {
    return false;
  }
};

export const getCollectionsOwned = async (publicAddress) => {
  const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT);
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress,
    connection,
    serialization: true,
  });

  const fetches = nfts.map(
    async ({ mint, data: { uri } }) =>
      await axios.get(`https://api.all.art/v1/solana/${mint}`)
  );
  const rawData = await Promise.all(fetches);
  const data = rawData.map(({ data }) => data).filter((data) => Boolean(data));
  console.log(data);
  throw false;
  const collections = data.map(({ Properties: { collection } }) => collection);
  return collections.filter(
    (a, i) =>
      collections.findIndex((s) => {
        if (a && s) {
          return a.name === s.name;
        }
        return false;
      }) === i
  );
};

export const checkIfNftOwner = async ({
  network,
  contractAddress,
  tokenId,
  mintAddress,
  publicAddress,
}) => {
  if (network === "Solana") {
    const {
      account: {
        data: {
          parsed: {
            info: { owner },
          },
        },
      },
    } = await getParsedAccountByMint({
      mintAddress,
      connection: new Connection(process.env.SOLANA_RPC_ENDPOINT),
    });
    return owner == publicAddress;
  }
  if (network === "Ethereum") {
    const {
      data: { owners },
    } = await axios.get(
      `${process.env.ALCHEMY_HTTP}/getOwnersForToken/?contractAddress=${contractAddress}&tokenId=${tokenId}`
    );
    return owners
      .map((x) => x.toLowerCase())
      .includes(publicAddress.toLowerCase());
  }
};

export const getNftImageLink = async ({
  network,
  contractAddress,
  tokenId,
  mintAddress,
}) => {
  if (network === "Solana") {
    const { image } = await getSolanaNftDetails(mintAddress);
    return image;
  }
  if (network === "Ethereum") {
    const {
      data: { media },
    } = await axios.get(
      `${process.env.ALCHEMY_HTTP}/getNFTMetadata/?contractAddress=${contractAddress}&tokenId=${tokenId}`
    );
    return media[0].gateway;
  }
};

export const getDaoMemberships = async (publicAddress) => {
  publicAddress = "6BnAzdBGmUdgcRaTaFGBvMAiAgC2cELiU5q12hBYb8YN";
  const { data: nfts } = await axios.get(
    `https://api.all.art/v1/wallet/${publicAddress}`
  );
  const allNfts = [...nfts.unlistedNfts, ...nfts.listedNfts];
  const families = [
    ...new Set(
      allNfts
        .map(({ Properties }) => {
          console.log(Properties.collection);
          return Properties.collection && Properties.collection.family;
        })
        .filter((x) => x !== undefined)
    ),
  ];

  return families;
};
