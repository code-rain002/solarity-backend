import * as yup from "yup";

export const updatePublicAddressSchema = yup.object({
  body: yup.object({
    publicAddress: yup
      .string()
      .typeError("Public address must be a string")
      .required("The public address is required"),
  }),
});

export const updatePasswordSchema = yup.object({
  body: yup.object({
    currentPassword: yup
      .string()
      .typeError("Current password must be a string")
      .required("Current password is required"),
    newPassword: yup
      .string()
      .typeError("New Password must be a string")
      .required("New Password is required"),
  }),
});

export const updateProfileSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .typeError("Name must be a string")
      .required("Name is required"),
  }),
});

export const connectTwitterSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .typeError("Twitter username must be a string")
      .required("Twitter username is required"),
  }),
});
