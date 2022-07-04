import express from "express";
import { register, login } from "../controllers/authController.js";
import { registerSchemaValidation } from "../middlewares/registerSchemaValidationMiddleware.js";
import { loginSchemaValidation } from "../middlewares/loginSchemaValidationMiddleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerSchemaValidation, register);
authRouter.post("/login", loginSchemaValidation, login);

export default authRouter;
