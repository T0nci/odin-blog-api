const { validationResult, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { validateToken, extractUser } = require("../utils/auth-middleware");

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

const postsGet = [
  asyncHandler(extractUser),
  asyncHandler(async (req, res) => {
    let where = null;
    if (req.user && req.user.is_author) where = {};
    else where = { is_published: true };

    const posts = await prisma.post.findMany({ where });

    res.json({ posts });
  }),
];

const postsPost = [
  asyncHandler(validateToken),
  asyncHandler(async (req, res, next) => {
    if (!req.user.is_author) return res.status(401).json({ error: "401" });

    next();
  }),
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
  postsGet,
  postsPost,
};
