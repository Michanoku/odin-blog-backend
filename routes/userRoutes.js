import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Register the user
router.post("/register", userController.register);

// Login the user using the callback provided
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: "Incorrect email or password.",
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },
  userController.login,
);

// Update the user
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.update,
);

// Set the users author status
router.put(
  "/authorStatus/:authorStatus",
  passport.authenticate("jwt", { session: false }),
  userController.changeAuthorStatus,
);

// Return the users records using the jwt
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  userController.getCurrentUser,
);

export default router;
