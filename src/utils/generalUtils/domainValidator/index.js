import prohibitedDomains from "./prohibitedDomains.json";
import UserModel from "../../../modules/User/model";

const MIN_LENGTH = 3;
const REGEX_CHECK = /^[a-z][a-z\d\w.]+$/;

export const domainValidator = async (domain) => {
  try {
    domain = domain.toLowerCase();
    const validFormat = REGEX_CHECK.test(domain);
    if (!validFormat) {
      return {
        available: false,
        reason:
          "Domain has invalid format, must be alphanumeric without any special characters and spaces.",
      };
    }

    const validLength = domain.length >= MIN_LENGTH;
    if (!validLength) {
      return {
        available: false,
        reason: `Domain must have at least ${MIN_LENGTH} characters`,
      };
    }

    if (prohibitedDomains.includes(domain)) {
      return {
        available: false,
        reason: `You cannot use this domain`,
      };
    }

    const domainExists = await UserModel.findOne(
      { username: `${domain}.verse` },
      { username: 1, userId: 1 }
    );

    if (domainExists) {
      return {
        available: false,
        reason: `Domain is in use`,
      };
    }
    return { domain, available: true };
  } catch (err) {
    return {
      available: false,
      reason: `Unable to validate the domain`,
    };
  }
};
