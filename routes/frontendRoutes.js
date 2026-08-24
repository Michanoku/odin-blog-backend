import express from "express";
const router = express.Router();

router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  },
);

export default router;