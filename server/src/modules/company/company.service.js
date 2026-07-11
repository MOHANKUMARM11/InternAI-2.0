const Company = require("../../models/Company");
const ApiError = require("../../utils/ApiError");
const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

const getMyProfile = async (userId) => {
  const company = await Company.findOne({ userId }).populate(
    "userId",
    "name email role"
  );

  if (!company) {
    throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMPANY_PROFILE_NOT_FOUND
    );
  }

  return company;
};

const updateMyProfile = async (userId, data) => {
  const company = await Company.findOneAndUpdate(
    { userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");

  if (!company) {
    throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMPANY_PROFILE_NOT_FOUND
    );
  }

  return company;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};