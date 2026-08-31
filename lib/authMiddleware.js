// Middleware to check user AUTH
import passport from "passport";

// Function that looks for a JWT, and if it's there
const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
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

const ownerAuth = (req, res, next) => {
    //blablaba
}

export {
    optionalAuth,
    ownerAuth,
}