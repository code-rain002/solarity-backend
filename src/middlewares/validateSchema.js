import { errorResponse } from "../helpers";
import * as yup from "yup";

export const paginationSharedObject = {
  page: yup
    .number()
    .typeError("Page must be a number")
    .min(1, "Page cannot be lesser than 1"),
  items: yup
    .number()
    .typeError("Items must be a number")
    .min(1, "Items cannot be lesser than 1"),
  term: yup.string().typeError("term must be a string"),
};

export const validateSchema =
  (
    schema = null,
    options = { includeQuery: false, idParamCheck: false, idName: "id" }
  ) =>
  async (req, res, next) => {
    if (!options.idName) options.idName = "id";
    if (options.idParamCheck)
      schema = yup.object({
        params: yup.object({
          [options.idName]: yup
            .string()
            .typeError("The ID must be a string")
            .required("The ID is required"),
        }),
      });
    try {
      const reqToValidate = {
        body: req.body,
        params: req.params,
      };
      if (options.includeQuery) reqToValidate.query = req.query;
      const validated = await schema.validate(reqToValidate, {
        stripUnknown: true,
      });
      const { body, params, query } = validated;
      req.body = body;
      req.params = params;
      req.query = query;
      return next();
    } catch (err) {
      return errorResponse({
        req,
        res,
        err,
      });
    }
  };
