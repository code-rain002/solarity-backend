import {
  successResponse,
  errorResponse,
  throwError,
  usernameValidator,
  domainValidator
} from "../../../utils";
import _ from "lodash";

export const checkDomainAvailabilityController = async (req, res) => {
  try {
    const {
      params: { domain },
      session: { userId },
    } = req;
    const { available, reason } = await domainValidator(domain, userId);
    if (!available) throwError(reason);
    return successResponse({ res, response: { available: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
