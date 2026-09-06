import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db";
import { errorResponse } from "../utils/responseHelper";

const jwtSecret = process.env.JWT_SECRET || "mental-companion-dev-secret";

// Authentication middleware for protecting routes
export interface AuthenticatedRequest extends Request {
  userId: string;
}

// Generate JWT token
export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });

// Middleware to authenticate requests
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return errorResponse(res, "Authorization token is required", null, 401);
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, jwtSecret);
    const userId = typeof payload === "string" ? undefined : payload.sub;

    if (typeof userId !== "string") {
      return errorResponse(res, "Invalid authorization token", null, 401);
    }

    // Check if user exists in database
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return errorResponse(res, "Invalid authorization token", null, 401);
    }

    (req as AuthenticatedRequest).userId = userId;
    return next();
  } catch {
    return errorResponse(res, "Invalid authorization token", null, 401);
  }
};
