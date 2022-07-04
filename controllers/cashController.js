import joi from "joi";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("api-mywallet");
});
const cashSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().required(),
});

export async function getCash(req, res) {
  const { authorization } = req.headers;
  const tokenAuth = authorization?.replace("Bearer", "").trim();

  //coleta todos os registros de caixa de todos os usuarios
  const cashRegisters = await db.collection("cash_in_out").find().toArray();

  //acha userId do usuario e token do usuario.
  const token = await db.collection("sessions").findOne({ token: tokenAuth });

  // acha usuario com name password e email e userId.
  const user = await db.collection("users").findOne({ _id: token.userId });
  delete user.password;

  //filtra apenas os registros que o usuário pode ver
  const cashFiltered = cashRegisters.filter(({ userId }) => {
    if (userId === undefined) {
      return false;
    }
    if (userId.equals(user._id)) {
      return true;
    }
  });

  res.send(cashFiltered);
}

export async function postCashIn(req, res) {
  const { authorization } = req.headers;
  const tokenAuth = authorization?.replace("Bearer", "").trim();

  const { value, description, type } = req.body;

  const validation = cashSchema.validate({ value, description, type });
  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }

  if (type !== "cash_in") {
    return res.sendStatus(400);
  }
  const token = await db.collection("sessions").findOne({ token: tokenAuth });

  if (!token) {
    return res.sendStatus(401);
  }
  const user = await db
    .collection("users")
    .findOne({ _id: ObjectId(token.userId) });

  if (!user) {
    return res.sendStatus(401);
  }
  delete user.password;
  await db.collection("cash_in_out").insertOne({
    userId: ObjectId(user._id),
    value,
    description,
    type,
    time: dayjs().format("DD/MM"),
  });

  res.status(200).send(user);
}
export async function postCashOut(req, res) {
  const { authorization } = req.headers;
  const tokenAuth = authorization?.replace("Bearer", "").trim();

  const { value, description, type } = req.body;

  const validation = cashSchema.validate({ value, description, type });
  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }
  if (type !== "cash_out") {
    return res.sendStatus(400);
  }
  const token = await db.collection("sessions").findOne({ token: tokenAuth });

  if (!token) {
    return res.sendStatus(401);
  }
  const user = await db
    .collection("users")
    .findOne({ _id: ObjectId(token.userId) });

  if (!user) {
    return res.sendStatus(400);
  }

  delete user.password;
  await db.collection("cash_in_out").insertOne({
    userId: ObjectId(user._id),
    value,
    description,
    type,
    time: dayjs().format("DD/MM"),
  });

  res.status(200).send(user);
}
