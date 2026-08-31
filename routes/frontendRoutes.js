import express from "express";
import passport from "passport";
import { optionalAuth, ownerAuth } from "../lib/authMiddleware.js";
import * as frontendController from "../controllers/frontendController.js";

const router = express.Router();

router.get("/posts", frontendController.postsGetAll);

router.get("/posts/:postId", optionalAuth, frontendController.postsGetSingle);

router.get("/posts/:postId/comments", frontendController.commentsGetAll);

router.get(
  "/posts/:postId/comments/:commentId",
  frontendController.commentsGetSingle,
);

router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  frontendController.commentsCreate,
);

router.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  ownerAuth,
  frontendController.commentsUpdate,
);

router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  ownerAuth,
  frontendController.commentsDelete,
);

export default router;
