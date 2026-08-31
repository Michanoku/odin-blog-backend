import express from "express";
import passport from "passport";
const router = express.Router();

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, action: "create" });
  },
);

router.get(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "read" });
  },
);

router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "update" });
  },
);

router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, postId: req.params.postId, action: "delete" });
  },
);

export default router;