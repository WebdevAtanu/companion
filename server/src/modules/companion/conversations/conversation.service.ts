import { createAIResponse, detectEmotion } from "../shared/aiHelper";
import { conversationRepository, messageRepository } from "../shared/repository";

export const listConversations = async (userId: string) =>
  conversationRepository.list(userId);

export const createConversation = async (userId: string, title?: string) =>
  conversationRepository.create(userId, title);

export const getConversation = async (userId: string, conversationId: string) => {
  const conversation = await conversationRepository.getById(conversationId, userId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const messages = await messageRepository.listByConversation(conversationId);

  return {
    ...conversation,
    messages,
  };
};

export const addMessage = async (
  userId: string,
  conversationId: string,
  messageText: string,
) => {
  const conversation = await conversationRepository.getById(conversationId, userId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const emotionTag = detectEmotion(messageText);

  const userMessage = await messageRepository.create(
    conversationId,
    "user",
    messageText,
    emotionTag,
  );

  const aiResponseText = await createAIResponse(userId, emotionTag, messageText);
  const aiMessage = await messageRepository.create(
    conversationId,
    "ai",
    aiResponseText,
    emotionTag,
  );

  if (conversation.title === "New conversation") {
    await conversationRepository.updateTitle(conversationId, messageText.slice(0, 60));
    conversation.title = messageText.slice(0, 60);
  }

  return {
    conversation,
    messages: [userMessage, aiMessage],
  };
};
