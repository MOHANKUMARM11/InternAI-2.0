const STATUS_CODES = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

const errorMiddleware = (err, req, res, next) => {
  return res.status(
    err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
  ).json({
    success: false,
    message: err.message || MESSAGES.SERVER_ERROR,
  });
};

module.exports = errorMiddleware;