import { errorResponse } from "../helpers";
import * as yup from "yup";

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
            .number()
            .typeError("The ID must be a number")
            .min(0, "Invalid ID provided")
            .required(),
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
