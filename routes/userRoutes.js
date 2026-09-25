import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.register);
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: info?.message || "Incorrect email or password.",
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },
  userController.login,
);

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.update,
);

router.put(
  "/authorStatus/:authorStatus",
  passport.authenticate("jwt", { session: false }),
  userController.changeAuthorStatus,
);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  userController.getCurrentUser,
);

export default router;
