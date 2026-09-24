const {
  createInternship,
  getMyInternships,
  getAllInternships,
  getInternshipById,
} = require("./internship.service");

const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/apiResponse");

const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

// Create Internship
const create = catchAsync(async (req, res) => {
  const internship = await createInternship(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    STATUS_CODES.CREATED,
    MESSAGES.INTERNSHIP_CREATED,
    internship
  );
});

const getMy = catchAsync(async (req, res) => {
  const internships = await getMyInternships(
    req.user._id
  );

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.MY_INTERNSHIPS_FETCHED,
    internships
  );
});

const getAll = catchAsync(async (req, res) => {
  const internships = await getAllInternships();

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.INTERNSHIPS_FETCHED,
    internships
  );
});

const getById = catchAsync(async (req, res) => {
  const internship = await getInternshipById(
    req.params.id
  );

  return successResponse(
    res,
    STATUS_CODES.OK,
    MESSAGES.INTERNSHIP_FETCHED,
    internship
  );
});

module.exports = {
  create,
  getMy,
  getAll,
  getById,
};