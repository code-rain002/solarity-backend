const yup = require("yup");

export const LoginUserSchema = yup.object({
  body: yup.object({
    publicAddress: yup
      .string()
      .typeError("Public address must be a string")
      .required("The public address is required"),
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
