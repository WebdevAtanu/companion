import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, notFoundError, userIdFrom } from "../../../utils/controllerHelper";
import * as conversationService from "./conversation.service";

export const listConversations = async (req: Request, res: Response) =>
  successResponse(
    res,
    "Conversations fetched",
    await conversationService.listConversations(userIdFrom(req)),
  );

export const createConversation = async (req: Request, res: Response) => {
  try {
    const data = z.object({ title: z.string().trim().optional() }).parse(req.body);
    const conversation = await conversationService.createConversation(
      userIdFrom(req),
      data.title,
    );

    return successResponse(res, "Conversation created", conversation, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      "Conversation fetched",
      await conversationService.getConversation(userIdFrom(req), req.params.id ?? ""),
    );
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    const data = z.object({ message: z.string().trim().min(1) }).parse(req.body);
    const result = await conversationService.addMessage(
      userIdFrom(req),
      req.params.id ?? "",
      data.message,
    );

    return successResponse(res, "Message processed", result, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};
