import { Request, Response } from "express";
import { z } from "zod";
import { errorResponse, successResponse } from "../../utils/responseHelper";
import { AuthenticatedRequest } from "./auth.middleware";
import * as authService from "./auth.service";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const session = await authService.register(data);

    return successResponse(res, "User registered successfully", session, 201);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message, null, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const session = await authService.login(data);

    return successResponse(res, "Login successful", session);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message, null, 401);
  }
};

export const me = (req: Request, res: Response) => {
  try {
    const user = authService.getMe((req as AuthenticatedRequest).userId);

    return successResponse(res, "User profile fetched", user);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message, null, 404);
  }
};
