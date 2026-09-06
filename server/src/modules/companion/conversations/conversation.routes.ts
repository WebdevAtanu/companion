import { Router } from "express";
import * as conversationController from "./conversation.controller";

const router = Router();

router.get("/", conversationController.listConversations);
router.post("/", conversationController.createConversation);
router.get("/:id", conversationController.getConversation);
router.post("/:id/messages", conversationController.addMessage);

export default router;
