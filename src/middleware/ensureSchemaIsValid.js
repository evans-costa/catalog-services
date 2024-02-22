export function ensureSchemaIsValid(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return next(error);
    }

    req.body = value;
    next();
  };
}
