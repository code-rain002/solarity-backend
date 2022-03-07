import * as yup from "yup";

export const getTweetsSchema = yup.object({
  query: yup.object({
    maxResults: yup
      .number()
      .typeError("Max results must be a number")
      .min(10, "Max results cannot be lesser than 10")
      .max(200, "Max results cannot be greater than 200"),
    userId: yup.string().typeError("User ID must be a string"),
    communityId: yup.string().typeError("Community ID must be a string"),
  }),
});
