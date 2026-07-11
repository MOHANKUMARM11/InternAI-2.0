const {
  getMyProfile,
  updateMyProfile,
} = require("./company.service");

const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/apiResponse");

const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Get Company Profile
const getProfile = catchAsync(async (req, res) => {
  const company = await getMyProfile(req.user._id);

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.COMPANY_PROFILE_FETCHED,
    company
  );
});

// Update Company Profile
const updateProfile = catchAsync(async (req, res) => {
  const company = await updateMyProfile(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.COMPANY_PROFILE_UPDATED,
    company
  );
});

module.exports = {
  getProfile,
  updateProfile,
};