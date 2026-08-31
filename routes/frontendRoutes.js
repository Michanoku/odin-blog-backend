import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, action: "readall" });
  },
);

router.get(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "read" });
  },
);

router.get(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, action: "readall" });
  },
);

router.post(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, action: "create" });
  },
);

router.get(
  "/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user,commentId: req.params.commentId, action: "read" });
  },
);

router.put(
  "/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user,commentId: req.params.commentId, action: "update" });
  },
);

router.delete(
  "/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user,commentId: req.params.commentId, action: "delete" });
  },
);

export default router;