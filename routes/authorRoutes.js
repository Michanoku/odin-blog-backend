import express from "express";
import passport from "passport";
import { authorAuth, postOwnerAuth } from "../lib/authMiddleware.js";
import * as authorController from "../controllers/authorController.js";
import * as frontendController from "../controllers/frontendController.js";
import { login } from "../controllers/userController.js";

const router = express.Router();

// Login the user with username and password
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      // If there is no user found, return message
      if (!user) {
        return res.status(401).json({
          message: "Incorrect email or password.",
        });
      }

      // If the user is not an author, reject
      if (!user.author) {
        return res.status(403).json({
          message: "Author access required.",
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },
  login,
);

// Get all posts of the author
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  authorController.postsGetAll,
);

// Create a new post
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  authorController.postsCreate,
);

// Get a single post by the author
router.get(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsGet,
);

// Update a single post by the author
router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsUpdate,
);

// Delete a single post by the author
router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsDelete,
);

// Get all comments on the author post
router.get(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsGetAll,
);

// Post a new comment on the author post
router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsCreate,
);

// Update a comment on the author post
router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsUpdate,
);

// Delete a comment on the author post
router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsDelete,
);

// Get the current author using the jwt
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  authorController.getCurrentAuthor,
);

export default router;
