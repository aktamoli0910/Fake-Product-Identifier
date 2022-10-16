const express = require("express");
const app = express();
require("dotenv").config();
const createError = require("http-errors");
require("./config/db");
const cors = require("cors");

app.use(cors());

// Parse the form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use("/", require("./routes"));

// Error handlers
app.use((req, res, next) => {
  next(createError.NotFound("Not found"));
});

app.use((err, req, res, next) => {
  console.log(err);

  res.send({
    success: false,
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log("The server is up and listening on PORT", process.env.PORT);
});
