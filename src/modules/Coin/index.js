import express from "express";
import { validateSchema } from "../../middlewares";
import { getCoins, addCoin, removeCoin } from "./controller";
import { addCoinSchema, removeCoinSchema } from "./schema";

const router = express.Router();

router.get("/", getCoins);

router.post("/", validateSchema(addCoinSchema), addCoin);

router.delete("/:symbol", validateSchema(removeCoinSchema), removeCoin);

export { router as coinModule };
