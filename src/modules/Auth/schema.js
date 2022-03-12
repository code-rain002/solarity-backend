const yup = require("yup");

export const LoginUserSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .typeError("Username is required")
      .trim()
      .required("The username is required"),
    password: yup
      .string()
      .typeError("Password is required")
      .required("Password is required"),
  }),
});

export const RegisterUserSchema = yup.object({
  body: yup.object({
    fullName: yup
      .string()
      .trim()
      .typeError("Full name is invalid")
      .min(4, "Full name is too short")
      .max(60, "Full name is too long")
      .required("Full name is required"),
    username: yup
      .string()
      .trim()
      .typeError("Username is invalid")
      .min(3, "Username is too short")
      .max(60, "Username is too long")
      .required("Username is required"),
    email: yup
      .string()
      .email()
      .typeError("Email is invalid")
      .trim()
      .required("Email is required"),
    password: yup
      .string()
      .typeError("Password is required")
      .required("Password is required"),
  }),
});

export const LoginUserWithPublicAddressSchema = yup.object({
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
