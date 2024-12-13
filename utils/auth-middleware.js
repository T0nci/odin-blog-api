const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const login = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username || "",
    },
  });
  const message = {
    errors: [{ msg: "Incorrect username and/or password" }],
  };

  if (!user) return res.status(400).json(message);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json(message);

  req.user = user;
  next();
};

// For protected routes
const validateToken = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) return res.status(401).json({ error: "401" });

  const token = header.split(" ")[1];

  jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "401" });

    req.user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    next();
  });
};

// For routes not protected that need customizations
const extractUser = async (req, res, next) => {
  const header = req.get("Authorization");
  if (header) {
    const token = header.split(" ")[1];

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
  }

  next();
};

// For routes that only the author can access
const isAuthor = (req, res, next) => {
  if (!req.user || !req.user.is_author) return res.json({ error: "401" });

  next();
};

// For returning a jsonwebtoken with information from req.user
const returnJsonToken = (req, res) => {
  const token = jsonwebtoken.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.json({ token, displayName: req.user.display_name });
};

module.exports = {
  login,
  validateToken,
  extractUser,
  isAuthor,
  returnJsonToken,
};
