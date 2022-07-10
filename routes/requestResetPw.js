const express = require("express");
const router = express.Router();
const User = require("../db/users");

// @route  POST /api/request-reset-password
// @desc   request-reset-password page
// @access Public
router.post("/request-reset-password", async (req, res) => {
  if (!req.body) {
    res.status(400).end();
    return;
  }

  // TODO
});

// @route  GET /api/request-reset-password/reset-password
// @desc   Reset password page
// @access Public
router.get("/reset-password", async (req, res) => {
  const { code } = req.query;

  // TODO
});

module.exports = router;
