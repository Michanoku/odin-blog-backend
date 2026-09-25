import jwt from "jsonwebtoken";
import { body, validationResult, matchedData } from "express-validator";
import { validatePassword, generateHash } from "../lib/passwordUtils.js";
import * as db from "../db/userQueries.js";

// Validation for user registration
const validateRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Email must be 255 characters or fewer")
    .custom(async (value) => {
      const existingUser = await db.lookupUserByEmail(value);
      if (existingUser) {
        throw new Error("Email already registered.");
      }
      return true;
    }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .bail()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters.")
    .custom(async (value) => {
      const existingUser = await db.lookupUserByUsername(value);
      if (existingUser) {
        throw new Error("Username already exists.");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 12, max: 72 })
    .withMessage("Password must be between 12 and 72 characters."),
  body("confirmation")
    .trim()
    .notEmpty()
    .withMessage("Confirmation is required.")
    .bail()
    .custom((value, { req }) => {
      const confirmation = req.body.password === value;
      if (!confirmation) {
        throw new Error("Confirmation does not match password.");
      }
      return true;
    }),
];

const validateUpdate = [
  body("email")
    .trim()
    .optional({ checkFalsy: true })
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Email must be 255 characters or fewer")
    .custom(async (value) => {
      const existingUser = await db.lookupUserByEmail(value);
      if (existingUser) {
        throw new Error("Email already registered.");
      }
      return true;
    }),
  body("username")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters.")
    .custom(async (value) => {
      const existingUser = await db.lookupUserByUsername(value);
      if (existingUser) {
        throw new Error("Username already exists.");
      }
      return true;
    }),
  body("password")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 12, max: 72 })
    .withMessage(`Password must be between 12 and 72 characters.`),
  body("confirmation")
    .trim()
    .custom((value, { req }) => {
      if (!req.body.password && !value) {
        return true;
      }

      if (!value) {
        throw new Error("Confirmation is required.");
      }

      if (req.body.password !== value) {
        throw new Error("Confirmation does not match password.");
      }

      return true;
    }),
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required.")
    .bail()
    .custom((value, { req }) => {
      const validation = validatePassword(value, req.user.hash);
      if (!validation) {
        throw new Error("Current password is incorrect.");
      }
      return true;
    }),
];

// Post route for register page
const register = [
  validateRegister,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // If the validation passed, generate a hash with the user password
    const { email, username, password } = matchedData(req);
    const hash = generateHash(password);

    try {
      const user = await db.createUser(username, email, hash);
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "72h",
      });
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

const login = (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.SECRET_KEY, {
    expiresIn: "72h",
  });
  return res.status(200).json({
    token,
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    },
  });
};

// Update user info
const update = [
  validateUpdate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // If the validation passed, generate a hash with the user password
    const { email, username, password } = matchedData(req);
    const hash = password ? generateHash(password) : null;

    // Create the user with the email and hash
    try {
      const updatedUser = await db.updateUser(
        req.user.id,
        username,
        email,
        hash,
      );
      return res.status(200).json({
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
      });
    } catch (err) {
      return next(err);
    }
  },
];

const changeAuthorStatus = async (req, res) => {
  const status = req.params.authorStatus === "true";
  await db.changeAuthorStatus(req.user.id, status);
  res.status(200).json({
    message: "User author status changed.",
    author: status,
  });
};

const getCurrentUser = (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
  });
};

export { register, login, update, changeAuthorStatus, getCurrentUser };
