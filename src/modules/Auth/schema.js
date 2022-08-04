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

export const UserExistSchema = yup.object({
  body: yup.object({
    publicKey: yup
      .string()
      .typeError("Public key must be a string")
      .required("The public key is required"),
    walletType: yup
      .string()
      .oneOf(["solana", "ethereum"])
      .required("The wallet type is required"),
  })
});

export const RegisterSchema = yup.object({
  body: yup.object({
    publicKey: yup
      .string()
      .typeError("Public key must be a string")
      .required("The public key is required"),
    walletType: yup
      .string()
      .oneOf(["solana", "ethereum"])
      .required("The wallet type is required"),
    username: yup
      .string()
      .typeError("User name must be a string")
      .required("User name is required"),
    bio: yup
      .string()
      .typeError("Bio must be a string"),
    profileImage: yup.object({
      link: yup
        .string()
        .typeError("Link of profile image must be a string")
        .required("Link of profile image is required"),
    })
  })
});
