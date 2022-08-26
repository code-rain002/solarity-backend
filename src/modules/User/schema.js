import * as yup from "yup";
import { paginationSharedObject } from "../../middlewares/validateSchema";

export const getUsersSchema = yup.object({
  query: yup.object({
    ...paginationSharedObject,
  }),
});

export const addDaoSchema = yup.object({
  body: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});

export const removeDaoSchema = yup.object({
  params: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});

export const getUserSchema = yup.object({
  params: yup.object({
    id: yup.string().required("The id is required"),
  }),
  query: yup.object({
    includeDao: yup.boolean().typeError("includeDao must be true/false"),
  }),
});

export const getEventsSchema = yup.object({
  query: yup.object({
    isPublic: yup.boolean().typeError("isPublic must be true/false"),
  }),
});