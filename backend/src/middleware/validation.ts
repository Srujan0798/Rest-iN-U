// Enhanced Input Validation Middleware
import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { BadRequestError } from "./errorHandler";

// Common validation chains
export const validateEmail = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Valid email required");

export const validatePassword = body("password")
  .isLength({ min: 8, max: 128 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage(
    "Password must be 8+ characters with uppercase, lowercase, and number",
  );

export const validateName = (field: string) =>
  body(field)
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage(
      `${field} must contain only letters, spaces, and basic punctuation`,
    );

export const validatePhone = body("phone")
  .optional()
  .matches(/^[\d\s\-\+\(\)]+$/)
  .withMessage("Invalid phone number format");

export const validateUUID = (field: string) =>
  param(field).isUUID().withMessage(`${field} must be a valid UUID`);

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

// Property validation
export const validatePropertyCreation = [
  validateName("title"),
  body("description")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be 10-2000 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("bedrooms")
    .isInt({ min: 0, max: 20 })
    .withMessage("Bedrooms must be 0-20"),
  body("bathrooms")
    .isFloat({ min: 0, max: 20 })
    .withMessage("Bathrooms must be 0-20"),
  body("squareFeet")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Square feet must be positive"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("streetAddress")
    .isLength({ min: 1, max: 200 })
    .withMessage("Street address required"),
  body("city")
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage("Invalid city name"),
  body("state")
    .isLength({ min: 2, max: 2 })
    .matches(/^[A-Z]{2}$/)
    .withMessage("State must be 2-letter uppercase"),
  body("zipCode")
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Invalid ZIP code"),
];

// Message validation
export const validateMessage = [
  body("content")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be 1-2000 characters"),
  body("subject")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Subject must be max 100 characters"),
];

// Validation result handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new BadRequestError(errorMessages.join(", ")));
  }

  next();
};

// Combined validation middleware
export const validate = (...validations: any[]) => [
  ...validations,
  handleValidationErrors,
];
