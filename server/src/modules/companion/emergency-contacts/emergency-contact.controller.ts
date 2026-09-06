import { Request, Response } from "express";
import { z } from "zod";
import { successResponse } from "../../../utils/responseHelper";
import { bodyError, notFoundError, userIdFrom, definedOnly } from "../../../utils/controllerHelper";
import * as emergencyContactService from "./emergency-contact.service";

export const listEmergencyContacts = async (req: Request, res: Response) =>
  successResponse(
    res,
    "Emergency contacts fetched",
    await emergencyContactService.listEmergencyContacts(userIdFrom(req)),
  );

export const createEmergencyContact = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        name: z.string().trim().min(1),
        phone: z.string().trim().min(3),
        relation: z.string().trim().min(1),
      })
      .parse(req.body);
    const contact = await emergencyContactService.createEmergencyContact(userIdFrom(req), data);

    return successResponse(res, "Emergency contact created", contact, 201);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
  try {
    const data = z
      .object({
        name: z.string().trim().min(1).optional(),
        phone: z.string().trim().min(3).optional(),
        relation: z.string().trim().min(1).optional(),
      })
      .parse(req.body);
    const contact = await emergencyContactService.updateEmergencyContact(
      userIdFrom(req),
      req.params.id ?? "",
      definedOnly(data),
    );

    return successResponse(res, "Emergency contact updated", contact);
  } catch (error: unknown) {
    return bodyError(res, error);
  }
};

export const deleteEmergencyContact = async (req: Request, res: Response) => {
  try {
    await emergencyContactService.deleteEmergencyContact(userIdFrom(req), req.params.id ?? "");

    return successResponse(res, "Emergency contact deleted");
  } catch (error: unknown) {
    return notFoundError(res, error);
  }
};
