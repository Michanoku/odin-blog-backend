import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login,
);


export default router;
