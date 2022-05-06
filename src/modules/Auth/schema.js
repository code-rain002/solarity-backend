const yup = require("yup");

export const LoginUserSchema = yup.object({
  body: yup.object({
    publicKey: yup
      .string()
      .typeError("Public key must be a string")
      .required("The public key is required"),
    walletType: yup
      .string()
      .oneOf(["solana", "ethereum"])
      .required("The wallet type is required"),
    requestNonce: yup
      .boolean()
      .typeError("Request nonce can either be true or false")
      .required("Request nonce is required"),
    signature: yup.string().when("requestNonce", {
      is: false,
      then: yup.string().required("The signature is required"),
    }),
  }),
});
