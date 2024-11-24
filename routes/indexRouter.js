const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/register", indexController.registerPost);
indexRouter.post("/login", indexController.loginPost);

module.exports = indexRouter;
