const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();

postRouter.get("/", postController.postsGet);
postRouter.get("/:postId", postController.postIdGet);
postRouter.post("/", postController.postsPost);
postRouter.put("/:postId", postController.postPut);

module.exports = postRouter;
