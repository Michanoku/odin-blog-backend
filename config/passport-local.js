// The local setup for passport, used then the user logs in with their credentials
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { validatePassword } from "../lib/passwordUtils.js";
import { lookupUserForLogin } from "../db/userQueries.js";

const verifyCallback = async (email, password, done) => {
  try {
    // First look up the user
    const user = await lookupUserForLogin(email);

    // If the user does not exist
    if (!user) {
      return done(null, false);
    }
    // Check if the password is correct
    const isValid = validatePassword(password, user.hash);

    // If the password is correct, return the user (strip the hash)
    if (isValid) {
      const { hash, ...safeUser } = user;
      return done(null, safeUser);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
};

// The username fields are handed manually to avoid the default
const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  verifyCallback,
);

passport.use(strategy);
