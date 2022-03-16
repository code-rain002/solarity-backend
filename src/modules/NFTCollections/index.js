import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftCollectionsController,
  addNftCollectionController,
  getNftCollectionController,
  removeNftCollection,
  statCollections,
} from "./controller";
import {
  addNftCollectionSchema,
  NftSymbolParamsSchema,
  getNftCollectionsSchema,
} from "./schema";

const router = express.Router();

// // stats fetch
// router.get("/stats", statCollections);

router.get(
  "/",
  validateSchema(getNftCollectionsSchema, { includeQuery: true }),
  getNftCollectionsController
);

// router.get(
//   "/:symbol",
//   validateSchema(NftSymbolParamsSchema, { includeQuery: true }),
//   getNftCollection
// );

// router.post(
//   "/collections",
//   validateSchema(addNftCollectionSchema),
//   addNftCollection
// );

// router.delete(
//   "/:symbol",
//   validateSchema(NftSymbolParamsSchema),
//   removeNftCollection
// );

export { router as nftCollectionModule };
