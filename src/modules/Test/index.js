import express from "express";
import { validateSchema } from "../../middlewares";
import { getTweets } from "./controller";

const router = express.Router();

router.get(
  "/tweets/:username",
  validateSchema(null, { idParamCheck: true, idName: "username" }),
  getTweets
);

// router.get(
//   "/collections/:symbol",
//   validateSchema(null, { idParamCheck: true, idName: "symbol" }),
//   getCollections
// );

// router.get(
//   "/nft/:mint",
//   validateSchema(null, { idParamCheck: true, idName: "mint" }),
//   async (req, res) => {
//     try {
//       const {
//         params: { mint },
//       } = req;
//       const { data } = await axios.get(
//         `https://api-mainnet.magiceden.dev/v2/tokens/${mint}`
//       );
//       return successResponse({ res, response: data });
//     } catch (err) {
//       return errorResponse({ res, err });
//     }
//   }
// );

export { router as testModule };
