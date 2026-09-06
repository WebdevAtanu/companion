import { moodRepository } from "../shared/repository";

export const listMoods = async (userId: string) =>
  moodRepository.list(userId);

export const createMood = async (
  userId: string,
  input: { mood: string; note?: string },
) =>
  moodRepository.create(userId, input.mood, input.note);

export const getMoodAnalytics = async (userId: string) =>
  moodRepository.getAnalytics(userId);
