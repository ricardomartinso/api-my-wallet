import cashSchema from "../schemas/cashSchema.js";

export function cashSchemaValidation(req, res, next) {
  const { value, description, type } = req.body;

  const validation = cashSchema.validate({ value, description, type });
  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    res.status(422).send(errors);
    return;
  }
  next();
}
