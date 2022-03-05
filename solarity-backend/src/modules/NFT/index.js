import express from "express";
import { validateSchema } from "../../middlewares";
import {
  getNftCollections,
  addNftCollection,
  getNftCollection,
  removeNftCollection,
} from "./controller";
import { addNftCollectionSchema, NftSymbolParamsSchema } from "./schema";

const router = express.Router();

router.get("/collections", getNftCollections);

router.get("/test", (req, res) => {
  const queue = req.app.get("nftQueue");
  queue.now("fetchCollection", "NOICE");
  queue.now("fetchCollection", "NOICE1");
  queue.now("fetchCollection", "NOICE3");
  res.send("done");
});

router.get(
  "/collections/:symbol",
  validateSchema(NftSymbolParamsSchema),
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
