const { body } = require("express-validator");

const createInternshipValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("mode")
    .isIn(["Onsite", "Remote", "Hybrid"])
    .withMessage("Mode must be Onsite, Remote or Hybrid"),

  body("stipend")
    .isNumeric()
    .withMessage("Stipend must be a number")
    .isFloat({ min: 0 })
    .withMessage("Stipend cannot be negative"),

  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration is required"),

  body("skillsRequired")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("eligibility")
    .optional()
    .isString()
    .withMessage("Eligibility must be a string"),

  body("applicationDeadline")
    .isISO8601()
    .withMessage("Invalid application deadline"),

  body("openings")
    .isInt({ min: 1 })
    .withMessage("Openings must be at least 1"),
];

module.exports = {
  createInternshipValidation,
};