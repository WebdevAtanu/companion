import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, notFoundError, userIdFrom, definedOnly } from "../../../utils/controllerHelper";
import * as reminderService from "./reminder.service";

export const listReminders = async (req: Request, res: Response) =>
  successResponse(
    res,
    "Reminders fetched",
    await reminderService.listReminders(userIdFrom(req)),
  );

export const createReminder = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1),
        remindAt: z.string().datetime(),
      })
      .parse(req.body);
    const reminder = await reminderService.createReminder(userIdFrom(req), data);

    return successResponse(res, "Reminder created", reminder, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1).optional(),
        remindAt: z.string().datetime().optional(),
        isCompleted: z.boolean().optional(),
      })
      .parse(req.body);
    const reminder = await reminderService.updateReminder(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Reminder updated", reminder);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    await reminderService.deleteReminder(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Reminder deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};
