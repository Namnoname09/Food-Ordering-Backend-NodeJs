const express = require("express");
const {
  createUser,
  UserLogin,
  refreshAccessToken,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/refresh", refreshAccessToken);
router.post("/register", createUser);
router.post("/login", UserLogin);

module.exports = router;
