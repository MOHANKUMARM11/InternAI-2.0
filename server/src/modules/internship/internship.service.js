const Internship = require("../../models/Internship");
const Company = require("../../models/Company");

const ApiError = require("../../utils/ApiError");
const STATUS_CODES = require("../../constants/statusCodes");
const MESSAGES = require("../../constants/messages");

const createInternship = async (userId, internshipData) => {
  // Find company profile of logged-in user
  const company = await Company.findOne({ userId });

  if (!company) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.COMPANY_PROFILE_NOT_FOUND
    );
  }

  // Create internship
  const internship = await Internship.create({
    ...internshipData,
    companyId: company._id,
    createdBy: userId,
  });

  return internship;
};

// Service function to get all internships created by a company

const getMyInternships = async (userId) => {
  // Find company profile
  const company = await Company.findOne({ userId });

  if (!company) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.COMPANY_PROFILE_NOT_FOUND
    );
  }

  // Fetch internships created by this company
  const internships = await Internship.find({
    companyId: company._id,
  }).sort({
    createdAt: -1,
  });

  return internships;
};

const getAllInternships = async () => {
  const internships = await Internship.find({
    status: "Open",
  })
    .populate("companyId", "companyName location")
    .sort({ createdAt: -1 });

  return internships;
};

const getInternshipById = async (internshipId) => {
  const internship = await Internship.findById(internshipId)
    .populate("companyId", "companyName location")
    .populate("createdBy", "name email");

  if (!internship) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.INTERNSHIP_NOT_FOUND
    );
  }

  return internship;
};

module.exports = {
  createInternship,
  getMyInternships,
  getAllInternships,
};