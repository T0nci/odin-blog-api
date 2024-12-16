const { Router } = require("express");
const commentController = require("../controllers/commentController");

const commentRouter = Router();

commentRouter.get("/:postId/comments", commentController.commentsGet);
commentRouter.post("/:postId/comments", commentController.commentsPost);
commentRouter.delete(
  "/:postId/comments/:commentId",
  commentController.commentsDelete,
);

module.exports = commentRouter;
