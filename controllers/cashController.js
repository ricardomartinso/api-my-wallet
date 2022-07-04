import joi from "joi";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import db from "../db.js";

export async function getCash(req, res) {
  const { authorization } = req.headers;
  const tokenAuth = authorization?.replace("Bearer", "").trim();

  const cashRegisters = await db.collection("cash_in_out").find().toArray();

  const token = await db.collection("sessions").findOne({ token: tokenAuth });

  const user = await db.collection("users").findOne({ _id: token.userId });
  delete user.password;

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
