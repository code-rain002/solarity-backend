import * as yup from "yup";

export const getTweetsSchema = yup.object({
  query: yup.object({
    maxResults: yup
      .number()
      .typeError("Max results must be a number")
      .min(10, "Max results cannot be lesser than 10")
      .max(200, "Max results cannot be greater than 200"),
    username: yup.string().typeError("Username must be a string"),
    symbol: yup.string().typeError("DAO symbol must be a string"),
  }),
});

export const getTweetsUsernameSchema = yup.object({
  params: yup.object({
    username: yup
      .string()
      .typeError("Username must be a string")
      .required("Username is required"),
  }),
});
