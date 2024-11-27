const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();

postRouter.get("/", postController.postsGet);
postRouter.get("/:postId", postController.postIdGet);
postRouter.post("/", postController.postsPost);
postRouter.put("/:postId", postController.postPut);
postRouter.delete("/:postId", postController.postDelete);
postRouter.get("/:postId/comments", postController.commentsGet);
postRouter.post("/:postId/comments", postController.commentsPost);
postRouter.delete(
  "/:postId/comments/:commentId",
  postController.commentsDelete,
);

module.exports = postRouter;
