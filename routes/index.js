import express from "express";
import authRouter from "./authRouter.js";
import cashRouter from "./cashRouter.js";

const router = express.Router();

router.use(authRouter);
router.use(cashRouter);

export default router;
