const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/register", indexController.registerPost);
indexRouter.post("/login", indexController.loginPost);
indexRouter.post("/login-author", indexController.loginAuthorPost);
indexRouter.get("/jwt-test", indexController.jwtTestGet);

module.exports = indexRouter;
