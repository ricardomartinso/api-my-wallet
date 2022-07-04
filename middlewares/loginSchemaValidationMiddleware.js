import loginSchema from "../schemas/loginSchema.js";

export function loginSchemaValidation(req, res, next) {
  const { password, email } = req.body;

  const validation = loginSchema.validate(
    { password, email },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    return res.status(422).send(errors);
  }
  next();
}
