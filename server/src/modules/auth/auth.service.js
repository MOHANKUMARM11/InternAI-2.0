const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/Student");

const ApiError = require("../../utils/ApiError");
const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Service function to sign up a new user
const signupUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      MESSAGES.USER_EXISTS
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
});

// Auto create student profile
if (role === "student") {
  await Student.create({
    userId: user._id,
  });
}

const userResponse = {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
};

return userResponse;
};


// Service function to log in a user

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.INVALID_CREDENTIALS
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.INVALID_CREDENTIALS
    );
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  signupUser,
  loginUser,
};