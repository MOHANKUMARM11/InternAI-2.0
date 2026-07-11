const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/rbac.middleware");

const {
  getProfile,
  updateProfile,
} = require("./company.controller");

const router = express.Router();

// Get Company Profile
router.get(
  "/me",
  authMiddleware,
  checkRole("company"),
  getProfile
);

// Update Company Profile
router.put(
  "/me",
  authMiddleware,
  checkRole("company"),
  updateProfile
);

module.exports = router; 