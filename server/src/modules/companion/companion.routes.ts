import { Router } from "express";
import { authenticate } from "./auth.middleware";
import * as companionController from "./companion.controller";

const router = Router();

router.use(authenticate);

router.get("/conversations", companionController.listConversations);
router.post("/conversations", companionController.createConversation);
router.get("/conversations/:id", companionController.getConversation);
router.post("/conversations/:id/messages", companionController.addMessage);

router.get("/moods", companionController.listMoods);
router.post("/moods", companionController.createMood);
router.get("/moods/analytics", companionController.moodAnalytics);

router.get("/journals", companionController.listJournals);
router.post("/journals", companionController.createJournal);
router.get("/journals/:id", companionController.getJournal);
router.put("/journals/:id", companionController.updateJournal);
router.delete("/journals/:id", companionController.deleteJournal);

router.get("/reminders", companionController.listReminders);
router.post("/reminders", companionController.createReminder);
router.put("/reminders/:id", companionController.updateReminder);
router.delete("/reminders/:id", companionController.deleteReminder);

router.get("/ai-profile", companionController.getAIProfile);
router.put("/ai-profile", companionController.updateAIProfile);

router.get("/emergency-contacts", companionController.listEmergencyContacts);
router.post("/emergency-contacts", companionController.createEmergencyContact);
router.put("/emergency-contacts/:id", companionController.updateEmergencyContact);
router.delete(
  "/emergency-contacts/:id",
  companionController.deleteEmergencyContact,
);

router.get("/suggestions", companionController.suggestions);

export default router;
