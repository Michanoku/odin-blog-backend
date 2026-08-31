import express from "express";
import passport from "passport";
import { optionalAuth, ownerAuth } from "../lib/authMiddleware.js";

const router = express.Router();

router.get(
  "/posts",
  (req, res) => {
    res.json({ action: "readallposts" });
  },
);

router.get(
  "/posts/:postId",
  optionalAuth,
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "readsinglepost" });
  },
);

router.get(
  "/posts/:postId/comments",
  (req, res) => {
    res.json( {postId: req.params.postId, action: "readallcomments" });
  },
);

router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "createcomment" });
  },
);

router.get(
  "/posts/:postId/comments/:commentId",
  (req, res) => {
    res.json({ postId: req.params.postId, commentId: req.params.commentId, action: "readsinglecomment" });
  },
);

router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  ownerAuth,
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, commentId: req.params.commentId, action: "updatecomment" });
  },
);

router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  ownerAuth,
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, commentId: req.params.commentId, action: "deletecomment" });
  },
);

export default router;