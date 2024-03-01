const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    if (req.file) {
      data.file = req.file;
    }
    if (req.files) {
      data.files = req.files;
    }
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      req.validationError = validationResult.error;
      return next(new Error("validation error", { cause: 400 }));
    }
    return next();
  };
};

export default validation;
