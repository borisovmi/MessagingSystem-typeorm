import { Router } from "express";
import { body } from "express-validator/src/middlewares/validation-chain-builders";
import { getRepository } from "typeorm";
import { loginController, signupController } from "../controllers/auth.ctrl";
import { hasValidationErrors } from "../middlewares/validation.mw";
import { User } from "../models/User";

const router = Router();

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  hasValidationErrors,
  loginController
);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  hasValidationErrors,
  signupController
);

export default router;
