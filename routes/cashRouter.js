import express from "express";

import {
  getCash,
  postCashIn,
  postCashOut,
} from "../controllers/cashController.js";

import { cashSchemaValidation } from "../middlewares/cashSchemaValidationMiddleware.js";
const cashRouter = express.Router();

cashRouter.get("/cash", getCash);
cashRouter.post("/cash-in", cashSchemaValidation, postCashIn);
cashRouter.post("cash-out", cashSchemaValidation, postCashOut);

export default cashRouter;
