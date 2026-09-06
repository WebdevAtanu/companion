import { aiProfileRepository } from "../shared/repository";

export const getAIProfile = async (userId: string) =>
  aiProfileRepository.getOrCreate(userId);

export const updateAIProfile = async (
  userId: string,
  input: Partial<{ tone: string; personality: string }>,
) =>
  aiProfileRepository.update(userId, input);
