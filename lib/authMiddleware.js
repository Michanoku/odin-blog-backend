// Middleware to check user AUTH
import passport from "passport";
import { getComment } from "../db/commentQueries.js";
import { getPost } from "../db/postQueries.js";

// Function that looks for a JWT, and if it's there return user, otherwise undefined
const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
    } else {
      req.user = undefined;
    }
    return next();
  })(req, res, next);
};

// Check if the user is the owner of the comment they wish to change / destroy
const commentOwnerAuth = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const comment = await getComment(commentId);

    if (userId !== comment.userId) {
      const err = new Error("Access denied.");
      err.status = 403;
      return next(err);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

// Check if the user is a verified author
const authorAuth = async (req, res, next) => {
  if (!req.user.author) {
    const err = new Error("Access denied.");
    err.status = 403;
    return next(err);
  }
  return next();
};

// Check if the user is the owner of the post they wish to change / destroy
const postOwnerAuth = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await getPost(postId);

    if (userId !== post.userId) {
      const err = new Error("Access denied.");
      err.status = 403;
      return next(err);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

export { optionalAuth, commentOwnerAuth, authorAuth, postOwnerAuth };
