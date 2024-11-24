const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/", postController.isAuthor, postController.postsPost);

module.exports = postRouter;
