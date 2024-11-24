const { validationResult, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const passport = require("passport");
const CustomError = require("../utils/CustomError");

const validatePost = () => [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters."),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be at least 1 character."),
];

const isAuthor = [
  passport.authenticate("jwt", { session: false, failWithError: true }),
  asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user || !user.is_author) throw new CustomError(401, "Unauthorized");

    next();
  }),
];

const postsPost = [
  validatePost(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });

    res.status(201).json({ post });
  }),
];

module.exports = {
  isAuthor,
  postsPost,
};
