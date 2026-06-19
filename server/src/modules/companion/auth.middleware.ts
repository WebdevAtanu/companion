import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../../utils/responseHelper";
import { store } from "./companion.store";

const jwtSecret = process.env.JWT_SECRET || "mental-companion-dev-secret";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });

export const authenticate = (
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

    if (typeof userId !== "string" || !store.users.has(userId)) {
      return errorResponse(res, "Invalid authorization token", null, 401);
    }

    (req as AuthenticatedRequest).userId = userId;
    return next();
  } catch {
    return errorResponse(res, "Invalid authorization token", null, 401);
  }
};
