import * as yup from "yup";
import { paginationSharedObject } from "../../middlewares/validateSchema";

export const getNftsSchema = yup.object({
  query: yup.object({
    ...paginationSharedObject,
    owner: yup
      .string()
      .typeError("Owner by must be a string")
      .required("Owner username is required"),
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
