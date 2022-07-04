import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use([cors(), express.json()]);
app.use(router);

app.listen(process.env.PORT);
