const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/rbac.middleware");
const validate = require("../../middlewares/validation.middleware");

const {
  create,
  getMy,
  getAll,
  getById,
} = require("./internship.controller");

const {
  createInternshipValidation,
} = require("./internship.validator");

const router = express.Router();

// Create Internship

router.get("/", getAll);
router.get("/:id", getById);

router.get(
    "/my",
    authMiddleware,
    checkRole("company"),
    getMy
);

router.post(
  "/",
  authMiddleware,
  checkRole("company"),
  createInternshipValidation,
  validate,
  create
);

module.exports = router;