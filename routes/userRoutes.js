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

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.update,
)

router.put(
  "/authorStatus/:authorStatus",
  passport.authenticate("jwt", { session: false }),
  userController.changeAuthorStatus,
)



export default router;
