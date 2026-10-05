import express from "express";
import passport from "passport";
import { optionalAuth, commentOwnerAuth } from "../lib/authMiddleware.js";
import * as frontendController from "../controllers/frontendController.js";

const router = express.Router();

// View all posts
router.get("/posts", optionalAuth, frontendController.postsGetAll);

// View a single post
router.get("/posts/:postId", optionalAuth, frontendController.postsGetSingle);

// View all comments of a post
router.get("/posts/:postId/comments", frontendController.commentsGetAll);

// Post new comment on a post
router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  frontendController.commentsCreate,
);

// Update a comment on a post
router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentOwnerAuth,
  frontendController.commentsUpdate,
);

// Delete a comment on a post
router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentOwnerAuth,
  frontendController.commentsDelete,
);

export default router;
