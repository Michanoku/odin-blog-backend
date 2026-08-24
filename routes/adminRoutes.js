import express from "express";
const router = express.Router();

router.post(
  "/blog",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  },
);

export default router;