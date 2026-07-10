const Student = require("../../models/Student");

const ApiError = require("../../utils/ApiError");
const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

const getMyProfile = async (userId) => {
  const student = await Student.findOne({ userId }).populate(
    "userId",
    "name email role"
  );

  if (!student) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.PROFILE_NOT_FOUND
    );
  }

  return student;
};

const updateMyProfile = async (userId, data) => {
  const student = await Student.findOneAndUpdate(
    { userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");

  if (!student) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.PROFILE_NOT_FOUND
    );
  }

  return student;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};