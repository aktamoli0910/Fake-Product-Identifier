const express = require("express");
const router = express.Router();

const authController = require("../../controllers/api/auth");

router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
