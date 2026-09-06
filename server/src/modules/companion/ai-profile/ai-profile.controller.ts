import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, userIdFrom, definedOnly } from "../../../utils/controllerHelper";
import * as aiProfileService from "./ai-profile.service";

export const getAIProfile = async (req: Request, res: Response) =>
  successResponse(
    res,
    "AI profile fetched",
    await aiProfileService.getAIProfile(userIdFrom(req)),
  );

export const updateAIProfile = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        tone: z.string().trim().min(1).optional(),
        personality: z.string().trim().min(1).optional(),
      })
      .parse(req.body);
    const profile = await aiProfileService.updateAIProfile(
      userIdFrom(req),
      definedOnly(data),
    );

    return successResponse(res, "AI profile updated", profile);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};
