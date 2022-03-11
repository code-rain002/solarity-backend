import * as yup from "yup";

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
