import {
  successResponse,
  errorResponse,
  throwError,
  domainValidator
} from "../../../utils";
import _ from "lodash";

export const checkDomainAvailabilityController = async (req, res) => {
  try {
    const {
      params: { domain },
    } = req;
    const { available, reason } = await domainValidator(domain);
    if (!available) throwError(reason);
    return successResponse({ res, response: { available: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
