const {
  getMyProfile,
  updateMyProfile,
} = require("./student.service");

const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/apiResponse");

const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Get Student Profile
const getProfile = catchAsync(async (req, res) => {
  const student = await getMyProfile(req.user._id);

  return successResponse(
    res,
    STATUS_CODES.OK,
    "Student profile fetched successfully",
    student
  );
});

// Update Student Profile
const updateProfile = catchAsync(async (req, res) => {
  const student = await updateMyProfile(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.PROFILE_UPDATED,
    student
  );
});

module.exports = {
  getProfile,
  updateProfile,
};