import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("api-mywallet");
});
const registerSchema = joi.object({
  name: joi.string().required(),
  password: joi.string().required(),
  email: joi.string().email().required(),
});

app.post("/register", async (req, res) => {
  // {
  //  name: "ricardo"
  //  password: "faskmfasfkam"
  //  email: "faksfpaso@fkapfkoas.com  "
  // }
  const register = req.body;

  const validate = registerSchema.validate(register, { abortEarly: false });

  if (validate.error) {
    const errors = validate.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }
  try {
    await db.collection("users").insertOne(register);
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000);
