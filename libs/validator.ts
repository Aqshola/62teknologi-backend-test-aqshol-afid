import { body } from "express-validator";

export const loginValidator = [
  body("username", "Username cannot be empty").not().isEmpty(),
  body("password", "Password cannot be empty")
    .not()
    .isEmpty()
    .isLength({ min: 6 }),
];
