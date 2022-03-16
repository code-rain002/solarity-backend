import * as yup from "yup";
import { paginationSharedObject } from "../../middlewares/validateSchema";

export const getNftsSchema = yup.object({
  query: yup.object({
    ...paginationSharedObject,
    ownedBy: yup.string().typeError("Owned by must be a string"),
  }),
});

export const nftAnalysisSchema = yup.object({
  body: yup.object({
    collectionSymbols: yup
      .array()
      .of(yup.string())
      .typeError("The collection symbols must be an array of string"),
    nftMintAddresses: yup
      .array()
      .of(yup.string())
      .typeError("The nft mint addresses must be an array of string"),
    startTime: yup.number().typeError("The start time must be a number"),
    endTime: yup.number().typeError("The end time must be a number"),
  }),
});

export const getNftCollectionsSchema = yup.object({
  query: yup.object({
    ...paginationSharedObject,
    following: yup.boolean().typeError("Following can either be true or false"),
  }),
});

export const addNftCollectionSchema = yup.object({
  body: yup.object({
    symbol: yup
      .string()
      .typeError("NFT collection symbol must be a string")
      .required("NFT collection symbol is required"),
  }),
});

export const NftSymbolParamsSchema = yup.object({
  params: yup.object({
    symbol: yup
      .string()
      .typeError("NFT collection symbol must be a string")
      .required("NFT collection symbol is required"),
  }),
  query: yup.object({
    excludeNfts: yup
      .boolean()
      .typeError("Exclude NFTs can either be true or false"),
  }),
});
