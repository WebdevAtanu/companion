import { Request, Response } from "express";
import * as userService from "./user.service";
import { successResponse, errorResponse } from "../../utils/responseHelper";

// Helper to parse ID safely
const parseId = (id: string) => {
  const num = Number(id);
  if (isNaN(num)) throw new Error("Invalid user ID");
  return num;
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "User ID is required", null, 400);
    }

    const user = await userService.getUser(parseId(id));

    return successResponse(res, "User fetched successfully", user);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    return successResponse(res, "User created", user, 201);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message);
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();

    return successResponse(res, "Users fetched", users);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "User ID is required", null, 400);
    }

    const user = await userService.updateUser(parseId(id), req.body);

    return successResponse(res, "User updated", user);
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "User ID is required", null, 400);
    }

    await userService.deleteUser(parseId(id));

    return successResponse(res, "User deleted");
  } catch (error: unknown) {
    return errorResponse(res, (error as Error).message);
  }
};
