const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/register", indexController.registerPost);

module.exports = indexRouter;
