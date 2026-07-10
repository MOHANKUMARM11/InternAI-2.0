const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/rbac.middleware");

const {
  getProfile,
  updateProfile,
} = require("./student.controller");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  checkRole("student"),
  getProfile
);

router.put(
  "/me",
  authMiddleware,
  checkRole("student"),
  updateProfile
);

module.exports = router;