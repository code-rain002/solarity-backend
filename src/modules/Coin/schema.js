import * as yup from "yup";

export const addCoinSchema = yup.object({
  body: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});

export const removeCoinSchema = yup.object({
  params: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});
