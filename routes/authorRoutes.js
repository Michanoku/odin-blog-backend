import express from "express";
import passport from "passport";
import { authorAuth, postOwnerAuth } from "../lib/authMiddleware.js";
import * as authorController from "../controllers/authorController.js";

const router = express.Router();

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

export default router;
