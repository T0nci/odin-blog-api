require("dotenv").config();
const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const CustomError = require("./utils/CustomError");

const app = express();

app.use(
  cors({
    origin: [process.env.USER_URL, process.env.AUTHOR_URL],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/posts", postRouter, commentRouter);

// if no route matched then this is a 404
app.use((req, res, next) => {
  next(new CustomError(404, "Not Found"));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === "invalid token" || err.message === "jwt expired") {
    err.statusCode = 401;
    err.message = "Unauthorized";
  } else if (!err.statusCode) {
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
