import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftCollections,
  addNftCollection,
  getNftCollection,
  removeNftCollection,
} from "./controller";
import {
  addNftCollectionSchema,
  NftSymbolParamsSchema,
  getNftCollectionsSchema,
} from "./schema";

const router = express.Router();

router.get(
  "/collections",
  validateSchema(getNftCollectionsSchema, { includeQuery: true }),
  getNftCollections
);

router.get(
  "/collections/:symbol",
  validateSchema(NftSymbolParamsSchema, { includeQuery: true }),
  getNftCollection
);

router.post(
  "/collections",
  validateSchema(addNftCollectionSchema),
  addNftCollection
);

router.delete(
  "/collections/:symbol",
  validateSchema(NftSymbolParamsSchema),
  removeNftCollection
);

export { router as nftModule };
