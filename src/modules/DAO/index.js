import express from "express";
import { validateSchema } from "../../middlewares";
import { getDaos, addDao, removeDao } from "./controller";
import { addDaoSchema, removeDaoSchema } from "./schema";

const router = express.Router();

router.get("/", getDaos);

router.post("/", validateSchema(addDaoSchema), addDao);

router.delete("/:symbol", validateSchema(removeDaoSchema), removeDao);

export { router as daoModule };
