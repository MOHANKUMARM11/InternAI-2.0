const { signupUser, loginUser } = require("./auth.service");

const {
  successResponse,
} = require("../../utils/apiResponse");

const catchAsync = require("../../utils/catchAsync");

const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Signup
const signup = catchAsync(async (req, res) => {
  const user = await signupUser(req.body);

  return successResponse(
    res,
    STATUS_CODES.CREATED,
    MESSAGES.USER_REGISTERED,
    user
  );
});

// Login
const login = catchAsync(async (req, res) => {
  const data = await loginUser(req.body);

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.LOGIN_SUCCESS,
    data
  );
});

module.exports = {
  signup,
  login,
};