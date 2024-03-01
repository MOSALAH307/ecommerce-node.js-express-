const globalError = (error, req, res, next) => {
  if (req.validationError) {
    return res
      .status(error.cause || 500)
      .json({ msg: error.message, validationError: req.validationError.details });
  }
    if (process.env.MOOD == "DEV") {
      return res
        .status(error.cause || 500)
        .json({ message: error.message, stack: error.stack });
    }
  return res.status(error.cause || 500).json({ message: error.message });
};

export default globalError;
