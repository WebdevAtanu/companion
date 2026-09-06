import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import conversationRoutes from "./conversations/conversation.routes";
import moodRoutes from "./moods/mood.routes";
import journalRoutes from "./journals/journal.routes";
import reminderRoutes from "./reminders/reminder.routes";
import emergencyContactRoutes from "./emergency-contacts/emergency-contact.routes";
import aiProfileRoutes from "./ai-profile/ai-profile.routes";
import { getSuggestions } from "./shared/suggestionHelper";
import { successResponse } from "../../utils/responseHelper";
import { userIdFrom } from "../../utils/controllerHelper";

const router = Router();

router.use(authenticate);

router.use("/conversations", conversationRoutes);
router.use("/moods", moodRoutes);
router.use("/journals", journalRoutes);
router.use("/reminders", reminderRoutes);
router.use("/emergency-contacts", emergencyContactRoutes);
router.use("/ai-profile", aiProfileRoutes);

router.get("/suggestions", async (req, res) =>
  successResponse(res, "Suggestions fetched", await getSuggestions(userIdFrom(req)))
);

export default router;
