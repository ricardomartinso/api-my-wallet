import registerSchema from "../schemas/loginSchema.js";

export function registerSchemaValidation(req, res, next) {
  const register = req.body;

  const validate = registerSchema.validate(register, { abortEarly: false });

  if (validate.error) {
    const errors = validate.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }
  next();
}
