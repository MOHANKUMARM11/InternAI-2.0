const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/rbac.middleware");

const router = express.Router();

router.get(
  "/student",
  authMiddleware,
  checkRole("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Student Route Accessed",
    });
  }
);

router.get(
  "/company",
  authMiddleware,
  checkRole("company"),
  (req, res) => {
    res.json({
      success: true,
      message: "Company Route Accessed",
    });
  }
);

router.get(
  "/admin",
  authMiddleware,
  checkRole("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin Route Accessed",
    });
  }
);

module.exports = router;