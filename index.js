import express from "express";
import cors from "cors";
import { login, register } from "./controllers/authController.js";
import {
  postCashIn,
  postCashOut,
  getCash,
} from "./controllers/cashController.js";

const app = express();
app.use([cors(), express.json()]);

app.post("/register", register);
app.post("/login", login);
app.get("/cash", getCash);
app.post("/cash-in", postCashIn);
app.post("/cash-out", postCashOut);

app.listen(5000);
