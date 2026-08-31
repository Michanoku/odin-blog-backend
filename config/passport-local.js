// This file contains the setup and config for passport and is imported into app.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { validatePassword } from "../lib/passwordUtils.js";
import { lookupUserByEmail } from "../db/userQueries.js";

const verifyCallback = async (email, password, done) => {
  try {
    const user = await lookupUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "Incorrect email or password." });
    }

    const isValid = validatePassword(password, user.hash);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect email or password." });
    }
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  verifyCallback
);

passport.use(strategy);