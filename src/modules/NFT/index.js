import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftsController,
  getNftController,
  getNftCollections,
  addNftCollection,
  getNftCollection,
  removeNftCollection,
} from "./controller";
import {
  addNftCollectionSchema,
  NftSymbolParamsSchema,
  getNftCollectionsSchema,
  getNftsSchema,
} from "./schema";

const router = express.Router();

router.get(
  "/",
  validateSchema(getNftsSchema, { includeQuery: true }),
  getNftsController
);

router.get(
  "/:mint",
  validateSchema(null, { idParamCheck: true, idName: "mint" }),
  getNftController
);

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
