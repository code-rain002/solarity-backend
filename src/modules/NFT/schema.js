import * as yup from "yup";
import { paginationSharedObject } from "../../middlewares/validateSchema";

export const getNftsSchema = yup.object({
  query: yup.object({
    ...paginationSharedObject,
    owner: yup
      .string()
      .typeError("Owner by must be a string")
      .required("Owner username is required"),
  }),
});
