import {
  errorResponse,
  successResponse,
} from "../../../utils";
import fetch from "node-fetch";

export const getWebsiteController = async (req, res) => {
  try {
    const { url } = req.params;
    const path = `https://${url}`;
    const response = await fetch(path);
    const urlContents = await response.text();

    // Prepend the base to make sure all relative and absolute paths work
    const urlContentsWithHead = `<head><base href='${path}' /></head>${urlContents}`;

    res.status(200).send(urlContentsWithHead);
  } catch (err) {
    return errorResponse({ res, err });
  }
};
