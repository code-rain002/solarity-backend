import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import axios from "axios";
import { Promise } from "bluebird";
import { NftModel } from "../modules/NFT/model";

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

export const checkIfOwnsNft = async (publicAddress) => {
  const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT);
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress,
    connection,
    sanitize: false,
    serialization: true,
  });
  return Boolean(nfts.length);
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
