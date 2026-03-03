import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Email is required or please required valid Email"),
  body("password")
    .isLength()
    .withMessage("Password must be 6 or more characters"),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.staus(400).json({ error: error.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required or please required valid Email"),
  body("password")
    .isLength()
    .withMessage("Password must be 6 or more characters"),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.staus(400).json({ error: error.array() });
    }
    next();
  },
];
