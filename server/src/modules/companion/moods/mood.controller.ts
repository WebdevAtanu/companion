import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, userIdFrom } from "../../../utils/controllerHelper";
import { moodSchema } from "../shared/validation";
import * as moodService from "./mood.service";

export const listMoods = async (req: Request, res: Response) =>
  successResponse(res, "Moods fetched", await moodService.listMoods(userIdFrom(req)));

export const createMood = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        mood: moodSchema,
        note: z.string().trim().optional(),
      })
      .parse(req.body);
    const mood = await moodService.createMood(userIdFrom(req), {
      mood: data.mood,
      ...(data.note ? { note: data.note } : {}),
    });

    return successResponse(res, "Mood saved", mood, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const moodAnalytics = async (req: Request, res: Response) =>
  successResponse(
    res,
    "Mood analytics fetched",
    await moodService.getMoodAnalytics(userIdFrom(req)),
  );
