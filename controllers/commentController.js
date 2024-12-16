const { validationResult, body, param } = require("express-validator");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const {
  validateToken,
  extractUser,
  isAuthor,
} = require("../utils/auth-middleware");
const { validatePostId } = require("./postController");

const validateComment = () =>
  body("comment")
    .trim()
    .isLength({ min: 1, max: 230 })
    .withMessage("Comment must contain between 1 and 230 characters.");

const validateCommentId = () =>
  param("commentId").custom(async (commentId, { req }) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
        post_id: Number(req.params.postId),
      },
    });

    if (!comment) throw false;
  });

const commentsGet = [
  validatePostId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json({ error: "404" });

    next();
  },
  asyncHandler(extractUser),
  asyncHandler(async (req, res) => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.postId),
      },
    });

    if (post.is_published || (req.user && req.user.is_author)) {
      const comments = await prisma.$queryRaw`
        SELECT c.id, content, date, display_name AS "displayName", is_author
        FROM "Comment" AS c
        JOIN "User" AS u
        ON c.user_id = u.id
        WHERE post_id = ${Number(req.params.postId)}
      `;

      return res.json({ comments });
    }

    res.status(404).json({ error: "404" });
  }),
];

const commentsPost = [
  asyncHandler(validateToken),
  validatePostId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json({ error: "404" });

    next();
  },
  validateComment(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.postId),
      },
    });
    if (!post.is_published) return res.status(404).json({ error: "404" });

    const comment = await prisma.comment.create({
      data: {
        content: req.body.comment,
        post_id: post.id,
        user_id: req.user.id,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    comment.displayName = user.display_name;
    delete comment.user_id;

    res.status(201).json({ comment });
  }),
];

const commentsDelete = [
  asyncHandler(validateToken),
  asyncHandler(isAuthor),
  validatePostId(),
  validateCommentId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json({ error: "404" });

    await prisma.comment.delete({
      where: {
        id: Number(req.params.commentId),
      },
    });

    res.json({ status: "200" });
  }),
];

module.exports = {
  commentsGet,
  commentsPost,
  commentsDelete,
};
