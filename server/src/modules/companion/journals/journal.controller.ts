import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, notFoundError, userIdFrom, definedOnly } from "../../../utils/controllerHelper";
import { moodSchema } from "../shared/validation";
import * as journalService from "./journal.service";

export const listJournals = async (req: Request, res: Response) =>
  successResponse(
    res,
    "Journals fetched",
    await journalService.listJournals(userIdFrom(req)),
  );

export const createJournal = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1),
        content: z.string().trim().min(1),
        mood: moodSchema,
      })
      .parse(req.body);
    const journal = await journalService.createJournal(userIdFrom(req), data);

    return successResponse(res, "Journal created", journal, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const getJournal = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      "Journal fetched",
      await journalService.getJournal(userIdFrom(req), req.params.id ?? ""),
    );
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const updateJournal = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1).optional(),
        content: z.string().trim().min(1).optional(),
        mood: moodSchema.optional(),
      })
      .parse(req.body);
    const journal = await journalService.updateJournal(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Journal updated", journal);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteJournal = async (req: Request, res: Response) => {
  try {
    await journalService.deleteJournal(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Journal deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};
