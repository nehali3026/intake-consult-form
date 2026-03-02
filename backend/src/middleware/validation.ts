import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateConsult = [
  body("userDetails")
    .notEmpty()
    .withMessage("User details are required")
    .isObject()
    .withMessage("User details must be an object"),
  body("userDetails.fullName").notEmpty().withMessage("Full name is required"),
  body("userDetails.email").isEmail().withMessage("Valid email is required"),
  body("userDetails.phone").notEmpty().withMessage("Phone number is required"),
  body("userDetails.dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required"),

  body("responses").isArray().withMessage("Responses must be an array"),
  body("responses.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required"),
  body("responses.*.questionType")
    .notEmpty()
    .withMessage("Question type is required"),
  body("responses.*.answer").notEmpty().withMessage("Answer is required"),

  body("timezone").notEmpty().withMessage("Timezone is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
