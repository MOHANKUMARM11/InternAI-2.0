const express = require("express");

const { signup, login } = require("./auth.controller");

const {
  signupValidation,
  loginValidation,
} = require("../../validators/auth.validator");

const validate = require("../../middlewares/validation.middleware");

const router = express.Router();

router.post(
  "/signup",
  signupValidation,
  validate,
  signup
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

module.exports = router;