const yup = require("yup");

export const LoginUserSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .typeError("Email is required")
      .trim()
      .required("The email is required"),
    password: yup
      .string()
      .typeError("Password is required")
      .required("Password is required"),
  }),
});

export const RegisterUserSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .typeError("Name is required")
      .trim()
      .required("Name is required"),
    email: yup
      .string()
      .typeError("Email is required")
      .email("Invalid email format")
      .trim()
      .required("Email is required"),
    password: yup
      .string()
      .typeError("Password is required")
      .required("Password is required"),
  }),
});
