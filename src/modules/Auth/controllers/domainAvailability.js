import { successResponse, errorResponse, domainValidator } from "../../../utils";

export const domainAvailabilityController = async (req, res) => {
  try {
    const {
      params: { domain },
    } = req;

    const { available, reason } = await domainValidator(domain);
    if (!!available) {
      return successResponse({ res, response: { available: true } });
    } else {
      return successResponse({ res, response: { available: false, reason } });
    }

  } catch (err) {
    return errorResponse({ res, err });
  }
};
