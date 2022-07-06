import joi from "joi";

const registerSchema = joi.object({
  name: joi.string().required(),
  password: joi.string().required(),
  email: joi.string().email().required(),
});
