const { validationResult } = require("express-validator");

const AppError = require("../utils/app-error");
const httpStatus = require("../constant/http-status.constant");

const errorFormat = (array) => {
  const error = array.reduce((acc, error) => {
    acc[error.path] = (acc[error.path] || []).concat(error.msg);
    return acc;
  }, {});
  return error;
};

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, httpStatus.FAIL, errorFormat(errors.array()));
  }
  next();
};

module.exports = validatorMiddleware;
