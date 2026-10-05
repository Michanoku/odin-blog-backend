import jwt from "jsonwebtoken";
import { body, validationResult, matchedData } from "express-validator";
import { validatePassword, generateHash } from "../lib/passwordUtils.js";
import * as db from "../db/userQueries.js";

// Validation for user registration, all fields are required
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
      // Make sure the email is not already in the system
      const existingUser = await db.lookupUser({ email: value });
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
      // Make sure the username isn't already in the system
      const existingUser = await db.lookupUser({ username: value });
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
      // Password must match confirmation
      const confirmation = req.body.password === value;
      if (!confirmation) {
        throw new Error("Confirmation does not match password.");
      }
      return true;
    }),
];

/* 
Validation for user update, all fields are optional, but the current password
must be provided. If a new password was set, the confirmation is also required.
*/
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
      // Make sure the new email isn't already in use
      const existingUser = await db.lookupUser({ email: value });
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
      // Make sure the new username isn't already in use
      const existingUser = await db.lookupUser({ username: value });
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
      // If both fields are empty, password was not set, return true
      if (!req.body.password && !value) {
        return true;
      }

      // If password is not empty but confirmatio is, return error
      if (!value) {
        throw new Error("Confirmation is required.");
      }

      // If password does not match confirmation, return error
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
    .custom(async (value, { req }) => {
      // Make sure the password is valid
      const user = await db.getUserHash(req.user.id);
      const validation = validatePassword(value, user.hash);
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
      // Create the user, sign a token and send the user and token back to the app
      const data = {
        username,
        email,
        hash,
      };
      const user = await db.createUser(data);
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "72h",
      });
      return res.status(201).json({
        token,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },
];

const login = (req, res) => {
  // If the user logged in succesfully sign a token and send the token and the user back to the app
  const token = jwt.sign({ userId: req.user.id }, process.env.SECRET_KEY, {
    expiresIn: "72h",
  });
  const user = {
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    author: req.user.author,
  };
  return res.status(200).json({
    token,
    user,
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
    const hash = password ? generateHash(password) : undefined;

    // Update the user with the email and hash
    try {
      const options = {
        username,
        email,
        hash,
      };
      const updatedUser = await db.updateUser(req.user.id, options);
      /* 
      Send the user back to the app. Do not send an updated token 
      (future consideration maybe, tokens currently only expire through time)
      */
      return res.status(200).json(updatedUser);
    } catch (error) {
      return next(error);
    }
  },
];

// This is to make any user an author, to test it out for this practice project
const changeAuthorStatus = async (req, res) => {
  const status = req.params.authorStatus === "true";
  await db.changeAuthorStatus(req.user.id, status);
  res.status(200).json({
    message: "User author status changed.",
    author: status,
  });
};

// Return the current user, used when trying to login with the JWT
const getCurrentUser = (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    author: req.user.author,
  });
};

export { register, login, update, changeAuthorStatus, getCurrentUser };
