import * as yup from "yup";

export const updatePublicAddressSchema = yup.object({
  body: yup.object({
    publicAddress: yup
      .string()
      .typeError("Public address must be a string")
      .required("The public address is required"),
  }),
});

export const UpdateAddressSchema = yup.object({
  body: yup.object({
    addresses: yup
      .array()
      .of(yup.string().typeError("Addresses must be an array of string"))
      .typeError("Addresses must be an array of string")
      .required("Addresses are required"),
  }),
});

export const UpdateCoinSchema = yup.object({
  body: yup.object({
    coins: yup
      .array()
      .of(yup.string().typeError("Coins must be an array of string"))
      .typeError("Coins must be an array of string")
      .required("Coins are required"),
  }),
});
