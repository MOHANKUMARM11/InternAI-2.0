const { signupUser, loginUser } = require("./auth.service");

const {
  successResponse,
  errorResponse,
} = require("../../utils/apiResponse");

const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Signup Controller
const signup = async (req, res) => {
  try {
    const user = await signupUser(req.body);

    return successResponse(
      res,
      STATUS_CODES.CREATED,
      MESSAGES.USER_REGISTERED,
      user
    );
  } catch (error) {
    return errorResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      error.message
    );
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    return successResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.LOGIN_SUCCESS,
      data
    );
  } catch (error) {
    return errorResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      error.message
    );
  }
};

module.exports = {
  signup,
  login,
};