import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../db.js";

export async function register(req, res) {
  const register = req.body;

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
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.send({ token, user });
  }
  res.status(404).send("Email ou senha incorretos!");
}
