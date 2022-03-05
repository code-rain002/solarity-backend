const yup = require("yup");

export const LoginUserSchema = yup.object({
  body: yup.object({
    email: yup
      .string("Email is required")
      .trim()
      .required("The email is required"),
    password: yup
      .string("Password is required")
      .required("Password is required"),
  }),
});
