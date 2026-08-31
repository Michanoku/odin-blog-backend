// Middleware to check user AUTH
import passport from "passport";
import { lookupCommentById } from "../db/commentQueries.js";

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

// Check if the user is the owner of the content they wish to change / destroy
const ownerAuth = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const comment = await lookupCommentById(commentId);

    if (userId === comment.userId) {
      return next();
    }

    const err = new Error("Access denied.");
    err.status = 403;
    return next(err);
  } catch (err) {
    return next(err);
  }
};

export { optionalAuth, ownerAuth };
