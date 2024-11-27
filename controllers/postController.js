const { validationResult, body, param } = require("express-validator");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const {
  validateToken,
  extractUser,
  isAuthor,
} = require("../utils/auth-middleware");

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

const validatePostUpdate = () =>
  body("action").custom((action, { req }) => {
    return action === "update" && req.body.title && req.body.content
      ? true
      : action === "publish"
        ? true
        : false;
  });

const validatePostId = () =>
  param("postId").custom(async (postId) => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) throw false;
  });

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
  asyncHandler(isAuthor),
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

const postIdGet = [
  validatePostId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json({ error: "404" });

    next();
  }),
  asyncHandler(extractUser),
  asyncHandler(async (req, res) => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.postId),
      },
    });

    if (post.is_published || (req.user && req.user.is_author))
      return res.json({ post });
    else return res.status(404).json({ error: "404" });
  }),
];

const postPut = [
  asyncHandler(validateToken),
  asyncHandler(isAuthor),
  validatePostId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json({ error: "404" });

    next();
  },
  validatePostUpdate(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json(
          req.body.action === "update"
            ? { error: "Missing arguments" }
            : { error: "Unknown action" },
        );

    const action = req.body.action;
    const postId = Number(req.params.postId);

    if (action === "update")
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
        },
      });
    else if (action === "publish") {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          is_published: true,
        },
      });

      const data = {};
      if (post.is_published) {
        data.is_published = false;
        data.date_published = null;
      } else {
        data.is_published = true;
        data.date_published = new Date().toISOString();
      }

      await prisma.post.update({
        where: {
          id: postId,
        },
        data,
      });
    }

    res.json({ status: "200" });
  }),
];

module.exports = {
  postsGet,
  postsPost,
  postIdGet,
  postPut,
};
