import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../../utils/responseHelper";
import { store } from "./companion.store";

const jwtSecret = process.env.JWT_SECRET || "mental-companion-dev-secret";

// Authentication middleware for protecting routes
export interface AuthenticatedRequest extends Request {
  userId: string;
}

// Generate JWT token
export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" }); // Token expires in 7 days

// Middleware to authenticate requests
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization; // Get authorization header

  // Check if authorization header is present
  if (!header?.startsWith("Bearer ")) {
    return errorResponse(res, "Authorization token is required", null, 401);
  }

  try {
    const token = header.slice("Bearer ".length); // Extract token from header
    const payload = jwt.verify(token, jwtSecret); // Verify token
    const userId = typeof payload === "string" ? undefined : payload.sub; // Get user ID from payload

    if (typeof userId !== "string" || !store.users.has(userId)) {
      return errorResponse(res, "Invalid authorization token", null, 401);
    }

    (req as AuthenticatedRequest).userId = userId;
    return next();
  } catch {
    return errorResponse(res, "Invalid authorization token", null, 401);
  }
};
