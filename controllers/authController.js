import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("api-mywallet");
});

export async function register(req, res) {
  const registerSchema = joi.object({
    name: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().email().required(),
  });
  const register = req.body;

  const validate = registerSchema.validate(register, { abortEarly: false });

  if (validate.error) {
    const errors = validate.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }
  try {
    const encryptedPassword = bcrypt.hashSync(register.password, 10);
    await db
      .collection("users")
      .insertOne({ ...register, password: encryptedPassword });
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(402);
  }
}
export async function login(req, res) {
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  const { password, email } = req.body;

  const validate = loginSchema.validate(
    { password, email },
    { abortEarly: false }
  );
  if (validate.error) {
    const errors = validate.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    const oldToken = await db
      .collection("sessions")
      .findOne({ userId: user._id });
    if (oldToken) {
      await db.collection("sessions").deleteOne({ userId: user._id });
    }
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.send({ token, user });
  }
  res.status(404).send("Email ou senha incorretos!");
}
