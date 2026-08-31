import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import passport from "passport";
import { lookupUserById } from "../db/userQueries.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
}

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await lookupUserById(jwt_payload.userId);
        // if other error? how to get it?  return error?
        if (user) {
            return done(null, user);
            // attach user or what
        } else {
            return done(null, false);
            // user undefined
        }
    } catch(err) {
        return done(err, false);
    }
}));