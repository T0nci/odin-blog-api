const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

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

const validateToken = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) return res.json({ error: "401" });

  const token = header.split(" ")[1];

  jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: "401" });

    req.user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    next();
  });
};

module.exports = {
  login,
  validateToken,
};
