// Input Sanitization Middleware
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { Request, Response, NextFunction } from "express";

// Create a DOMPurify instance with JSDOM
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Sanitize HTML content
export const sanitizeHtml = (dirty: string): string => {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"],
    ALLOW_DATA_ATTR: false,
  });
};

// Sanitize string input (remove potentially dangerous characters)
export const sanitizeString = (input: string): string => {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove <>
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

// Sanitize email
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/[<>]/g, "");
};

// Sanitize phone number
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\-\s()]/g, "");
};

// Middleware to sanitize request body
export const sanitizeRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
};

// Recursively sanitize object properties
function sanitizeObject(obj: any): void {
  if (typeof obj !== "object" || obj === null) return;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "string") {
        // Apply different sanitization based on field name
        if (key.toLowerCase().includes("email")) {
          obj[key] = sanitizeEmail(value);
        } else if (key.toLowerCase().includes("phone")) {
          obj[key] = sanitizePhone(value);
        } else if (
          key.toLowerCase().includes("description") ||
          key.toLowerCase().includes("content") ||
          key.toLowerCase().includes("message") ||
          key.toLowerCase().includes("bio")
        ) {
          obj[key] = sanitizeHtml(value);
        } else {
          obj[key] = sanitizeString(value);
        }
      } else if (typeof value === "object") {
        sanitizeObject(value);
      }
    }
  }
}

// XSS Protection Headers
export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};
