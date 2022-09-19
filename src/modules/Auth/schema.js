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

export const SetStepSchema = yup.object({
  body: yup.object({
    stepNum: yup
      .number()
      .typeError("Step Number must be a number")
      .required("The StepNum is required"),
    flag: yup
      .boolean()
      .typeError("Flag must be true/false")
      .required("The Flag is required"),
    data: yup.object({
      username: yup.string().typeError("User name must be a string").notRequired(),
      bio: yup.string().typeError("Bio must be a string").notRequired(),
      daos: yup.array().notRequired(),
      profileImage: yup.object({
        link: yup.string().typeError('This field requires string value'),
        network: yup.string().typeError('This field requires string value'),
        contractAddress: yup.string().typeError('This field requires string value'),
        tokenId: yup.string().typeError('This field requires string value'),
        mintAddress: yup.string().typeError('This field requires string value'),
      }).notRequired(),
      passportStyle: yup.object({
        logo: yup.string().typeError('This field requires string value'),
        background: yup.string().typeError('This field requires string value'),
        line: yup.string().typeError('This field requires string value'),
        text: yup.string().typeError('This field requires string value'),
      }).notRequired(),
      badges: yup.array().notRequired()
    })
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
