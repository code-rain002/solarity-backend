import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftsController,
  getNftController,
  getNftCollections,
  addNftCollection,
  getNftCollection,
  removeNftCollection,
  nftAnalysisController,
  getNftAnalysisController,
} from "./controller";
import {
  addNftCollectionSchema,
  NftSymbolParamsSchema,
  getNftCollectionsSchema,
  getNftsSchema,
  nftAnalysisSchema,
} from "./schema";

const router = express.Router();

router.get(
  "/",
  validateSchema(getNftsSchema, { includeQuery: true }),
  getNftsController
);

router.get("/analysis", getNftAnalysisController);

router.get(
  "/:mint",
  validateSchema(null, { idParamCheck: true, idName: "mint" }),
  getNftController
);

router.post(
  "/analysis",
  validateSchema(nftAnalysisSchema),
  nftAnalysisController
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
