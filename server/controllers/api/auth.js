const bcrypt = require("bcrypt");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();

    if (user) {
      const isMatched = await bcrypt.compare(password, user.password);

      if (isMatched) {
        //   Payload for JWT
        const payload = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        // JWT issue to user
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({
          success: true,
          message: "Log in success",
          token,
        });
      } else {
        throw createError.Forbidden("Wrong username or password");
      }
    } else {
      throw createError.BadRequest("Email does not exist");
    }
  } catch (err) {
    next(err);
  }
};

signup = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      throw createError.BadRequest("Empty form fields submitted");
    }

    // Email already exists
    const user = await User.findOne({ email });

    if (user) {
      throw createError.BadRequest("User with email already exists");
    } else {
      // Hash password before storing in the database
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));

      const hashedPassword = await bcrypt.hash(password, salt);

      //   Save user to database
      await User({
        name,
        email,
        password: hashedPassword,
        address,
        role,
      }).save();

      return res
        .status(200)
        .json({ success: true, message: "Sign up successful" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { login, signup };
