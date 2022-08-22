import * as yup from "yup";

export const getEventsSchema = yup.object({
  query: yup.object({
    isPublic: yup.boolean().typeError("isPublic must be true/false"),
  }),
});

export const createEventSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .typeError("Title must be a string")
      .required("Title is required"),
  }),
});
