import * as yup from "yup";

export const getEventsSchema = yup.object({
  query: yup.object({
    isPrivate: yup.boolean().typeError("isPrivate must be true/false"),
  }),
});

export const createEventSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .typeError("Title must be a string")
      .required("Title is required"),
    image: yup
      .string()
      .typeError("Image must be a string")
      .required("Image is required"),
    type: yup
      .string()
      .typeError("Room type must be a string")
      .required("Room type is required"),
    isPrivate: yup
      .boolean()
      .typeError("isPrivate must be true/false"),
    friends: yup
      .array()
  }),
});
