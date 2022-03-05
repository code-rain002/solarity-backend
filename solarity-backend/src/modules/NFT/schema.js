import * as yup from "yup";

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
});
