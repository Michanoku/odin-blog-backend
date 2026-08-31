import jwt from "jsonwebtoken";
import { generateHash } from "../lib/passwordUtils.js";
import * as db from "../db/userQueries.js";

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await db.lookupUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = generateHash(password);

    const user = await db.createUser(username, email, hash)

    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    next(err);
  }
}

const login = (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.SECRET_KEY,
      { expiresIn: "72h" }
    );

    res.json({ token });
  }

export {
    register,
    login,
}