const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

const login = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  const message = {
    errors: [{ msg: "Incorrect username and/or password" }],
  };

  if (!user) return res.json(message);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.json(message);

  req.user = user;
  next();
};

module.exports = {
  login,
};
