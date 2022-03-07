import * as yup from "yup";

export const getNftCollectionsSchema = yup.object({
  query: yup.object({
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
