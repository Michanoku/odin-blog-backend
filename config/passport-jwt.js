// The JsonWebToken strategy for passport, used after a user has logged in
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import { lookupUser } from "../db/userQueries.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await lookupUser({ id: jwt_payload.userId });
      // If user is found, return no error and the user
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // if user is not found, return no error and no user
      }
    } catch (error) {
      // If an error happened, return error and no user
      return done(error);
    }
  }),
);
