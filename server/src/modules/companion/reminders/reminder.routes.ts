import { Router } from "express";
import * as reminderController from "./reminder.controller";

const router = Router();

router.get("/", reminderController.listReminders);
router.post("/", reminderController.createReminder);
router.put("/:id", reminderController.updateReminder);
router.delete("/:id", reminderController.deleteReminder);

export default router;
