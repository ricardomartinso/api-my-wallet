import express from "express";
import authRouter from "./authRouter";
import cashRouter from "./cashRouter";

const router = express.Router();

router.use(authRouter);
router.use(cashRouter);
export default router;
