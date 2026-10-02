import express from "express";
import passport from "passport";
import { authorAuth, postOwnerAuth } from "../lib/authMiddleware.js";
import * as authorController from "../controllers/authorController.js";
import * as frontendController from "../controllers/frontendController.js";
import { login } from "../controllers/userController.js";

const router = express.Router();

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

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  authorController.postsGetAll,
);

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  authorController.postsCreate,
);

router.get(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsGet,
);

router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsUpdate,
);

router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  authorController.postsDelete,
);

router.get(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsGetAll,
);

router.get(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),

  authorAuth,
  postOwnerAuth,
  frontendController.commentsGetSingle,
);

router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsCreate,
);

router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsUpdate,
);

router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  authorAuth,
  postOwnerAuth,
  frontendController.commentsDelete,
);

router.get(
  "/me",
  (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: info?.message || "Authentication required.",
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },
  authorController.getCurrentUser,
);

export default router;
