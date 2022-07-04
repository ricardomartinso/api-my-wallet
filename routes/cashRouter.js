import express from "express";
import {
  getCash,
  postCashIn,
  postCashOut,
} from "../controllers/cashController";

const cashRouter = express.Router();

cashRouter.get("/cash", getCash);
cashRouter.post("/cash-in", postCashIn);
cashRouter.post("cash-out", postCashOut);

export default cashRouter;
