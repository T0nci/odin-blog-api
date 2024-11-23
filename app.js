require("dotenv").config();
const express = require("express");
const cors = require("cors");
const CustomError = require("./utils/CustomError");

const app = express();

app.use(
  cors({
    origin: [process.env.USER_URL, process.env.AUTHOR_URL],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if no route matched then this is a 404
app.use((req, res, next) => {
  next(new CustomError(404, "Not Found"));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    console.error(err);
    err.statusCode = 500;
    err.message = "Internal Server Error";
  }
  res
    .status(err.statusCode)
    .json({ error: `${err.statusCode}: ${err.message}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Blog API listening on port ${PORT}!`));
