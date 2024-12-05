const { validationResult, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const { login, validateToken } = require("../utils/auth-middleware");
const jwt = require("jsonwebtoken");

const validateRegister = () => [
  body("username")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Username must be between 1 and 20 characters long.")
    .custom((username) => /^[a-zA-Z0-9._]+$/.test(username))
    .withMessage(
      "Username must only contain letters of the alphabet, numbers, '.' and/or '_'.",
    )
    .custom(async (username) => {
      const result = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (result) throw false;
    })
    .withMessage("Username already exists."),
  body("password")
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must contain between 6 and 50 characters.")
    .custom((password) => {
      if (!/[a-z]/.test(password)) return false;
      if (!/[A-Z]/.test(password)) return false;
      if (!/[0-9]/.test(password)) return false;
      if (!/[`~!@#$%^&*()\-_=+{}[\]|\\;:'",<.>/?]/.test(password)) return false;
      return true;
    })
    .withMessage(
      "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol.",
    ),
  body("confirm")
    .trim()
    .custom((password, { req }) => password === req.body.password)
    .withMessage("Passwords don't match."),
  body("displayName")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Display name must be between 1 and 20 characters long.")
    .custom(async (display_name) => {
      const result = await prisma.user.findUnique({
        where: {
          display_name,
        },
      });

      if (result) throw false;
    })
    .withMessage("Display name already exists."),
];

const registerPost = [
  validateRegister(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err)
        return res
          .status(500)
          .json({ errors: [{ msg: "Error creating user." }] });

      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
          display_name: req.body.displayName,
        },
      });

      return res.status(201).json({ displayName: user.display_name });
    });
  }),
];

const loginPost = [
  asyncHandler(login),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  },
];

const jwtTestGet = [
  asyncHandler(validateToken),
  (req, res) => {
    res.json({ response: req.user.id });
  },
];

module.exports = {
  registerPost,
  loginPost,
  jwtTestGet,
};
