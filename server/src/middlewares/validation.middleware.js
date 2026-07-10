const { validationResult } = require("express-validator");

const {
  errorResponse,
} = require("../utils/apiResponse");

const STATUS_CODES = require("../constants/statusCodes");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      "Validation failed",
      errors.array()
    );
  }

  next();
};

module.exports = validate;