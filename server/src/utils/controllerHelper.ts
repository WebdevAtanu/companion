import { Request, Response } from "express";
import { errorResponse } from "./responseHelper";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const userIdFrom = (req: Request) =>
  (req as AuthenticatedRequest).userId;

export const bodyError = (res: Response, error: unknown) =>
  errorResponse(res, (error as Error).message, null, 400);

export const notFoundError = (res: Response, error: unknown) =>
  errorResponse(res, (error as Error).message, null, 404);

export const definedOnly = <T extends Record<string, unknown>>(input: T) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as { [K in keyof T]?: Exclude<T[K], undefined> };
