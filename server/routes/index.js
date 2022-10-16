const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.end("API is running");
});

router.use("/api", require("./api"));

module.exports = router;
