const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { create } = require("../models/user");
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw createError.Unauthorized("Invalid token");
    }

    const token = req.headers.authorization.split(" ")[1];

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isAuthenticated };
