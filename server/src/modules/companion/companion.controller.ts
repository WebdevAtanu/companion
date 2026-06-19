import { Request, Response } from "express";
import { z } from "zod";
import { errorResponse, successResponse } from "../../utils/responseHelper";
import { AuthenticatedRequest } from "./auth.middleware";
import * as companionService from "./companion.service";

const moodSchema = z.enum([
  "happy",
  "sad",
  "stressed",
  "anxious",
  "calm",
  "hopeful",
  "neutral",
]);

const userIdFrom = (req: Request) => (req as AuthenticatedRequest).userId;

const bodyError = (res: Response, error: unknown) =>
  errorResponse(res, (error as Error).message, null, 400);

const notFoundError = (res: Response, error: unknown) =>
  errorResponse(res, (error as Error).message, null, 404);

const definedOnly = <T extends Record<string, unknown>>(input: T) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as { [K in keyof T]?: Exclude<T[K], undefined> };

export const listConversations = (req: Request, res: Response) =>
  successResponse(
    res,
    "Conversations fetched",
    companionService.listConversations(userIdFrom(req)),
  );

export const createConversation = (req: Request, res: Response) => {
  try {
    const data = z.object({ title: z.string().trim().optional() }).parse(req.body);
    const conversation = companionService.createConversation(
      userIdFrom(req),
      data.title,
    );

    return successResponse(res, "Conversation created", conversation, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const getConversation = (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      "Conversation fetched",
      companionService.getConversation(userIdFrom(req), req.params.id ?? ""),
    );
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const addMessage = (req: Request, res: Response) => {
  try {
    const data = z.object({ message: z.string().trim().min(1) }).parse(req.body);
    const result = companionService.addMessage(
      userIdFrom(req),
      req.params.id ?? "",
      data.message,
    );

    return successResponse(res, "Message processed", result, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const listMoods = (req: Request, res: Response) =>
  successResponse(res, "Moods fetched", companionService.listMoods(userIdFrom(req)));

export const createMood = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        mood: moodSchema,
        note: z.string().trim().optional(),
      })
      .parse(req.body);
    const mood = companionService.createMood(userIdFrom(req), {
      mood: data.mood,
      ...(data.note ? { note: data.note } : {}),
    });

    return successResponse(res, "Mood saved", mood, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const moodAnalytics = (req: Request, res: Response) =>
  successResponse(
    res,
    "Mood analytics fetched",
    companionService.getMoodAnalytics(userIdFrom(req)),
  );

export const listJournals = (req: Request, res: Response) =>
  successResponse(
    res,
    "Journals fetched",
    companionService.listJournals(userIdFrom(req)),
  );

export const createJournal = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1),
        content: z.string().trim().min(1),
        mood: moodSchema,
      })
      .parse(req.body);
    const journal = companionService.createJournal(userIdFrom(req), data);

    return successResponse(res, "Journal created", journal, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const getJournal = (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      "Journal fetched",
      companionService.getJournal(userIdFrom(req), req.params.id ?? ""),
    );
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const updateJournal = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1).optional(),
        content: z.string().trim().min(1).optional(),
        mood: moodSchema.optional(),
      })
      .parse(req.body);
    const journal = companionService.updateJournal(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Journal updated", journal);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteJournal = (req: Request, res: Response) => {
  try {
    companionService.deleteJournal(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Journal deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const listReminders = (req: Request, res: Response) =>
  successResponse(
    res,
    "Reminders fetched",
    companionService.listReminders(userIdFrom(req)),
  );

export const createReminder = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1),
        remindAt: z.string().datetime(),
      })
      .parse(req.body);
    const reminder = companionService.createReminder(userIdFrom(req), data);

    return successResponse(res, "Reminder created", reminder, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const updateReminder = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        title: z.string().trim().min(1).optional(),
        remindAt: z.string().datetime().optional(),
        isCompleted: z.boolean().optional(),
      })
      .parse(req.body);
    const reminder = companionService.updateReminder(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Reminder updated", reminder);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteReminder = (req: Request, res: Response) => {
  try {
    companionService.deleteReminder(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Reminder deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const getAIProfile = (req: Request, res: Response) =>
  successResponse(
    res,
    "AI profile fetched",
    companionService.getAIProfile(userIdFrom(req)),
  );

export const updateAIProfile = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        tone: z.string().trim().min(1).optional(),
        personality: z.string().trim().min(1).optional(),
      })
      .parse(req.body);
    const profile = companionService.updateAIProfile(
      userIdFrom(req),
      definedOnly(data),
    );

    return successResponse(res, "AI profile updated", profile);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const listEmergencyContacts = (req: Request, res: Response) =>
  successResponse(
    res,
    "Emergency contacts fetched",
    companionService.listEmergencyContacts(userIdFrom(req)),
  );

export const createEmergencyContact = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        name: z.string().trim().min(1),
        phone: z.string().trim().min(3),
        relation: z.string().trim().min(1),
      })
      .parse(req.body);
    const contact = companionService.createEmergencyContact(userIdFrom(req), data);

    return successResponse(res, "Emergency contact created", contact, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const updateEmergencyContact = (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        name: z.string().trim().min(1).optional(),
        phone: z.string().trim().min(3).optional(),
        relation: z.string().trim().min(1).optional(),
      })
      .parse(req.body);
    const contact = companionService.updateEmergencyContact(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Emergency contact updated", contact);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteEmergencyContact = (req: Request, res: Response) => {
  try {
    companionService.deleteEmergencyContact(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Emergency contact deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const suggestions = (req: Request, res: Response) =>
  successResponse(
    res,
    "Suggestions fetched",
    companionService.getSuggestions(userIdFrom(req)),
  );
