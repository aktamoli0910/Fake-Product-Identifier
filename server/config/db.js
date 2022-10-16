const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database."))
  .catch((err) => console.log("Error connecting to the database", err));

const db = mongoose.connection;

module.exports = db;
