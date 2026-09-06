import { reminderRepository } from "../shared/repository";

export const listReminders = async (userId: string) =>
  reminderRepository.list(userId);

export const createReminder = async (
  userId: string,
  input: { title: string; remindAt: string },
) =>
  reminderRepository.create(userId, input.title, input.remindAt);

export const updateReminder = async (
  userId: string,
  id: string,
  input: Partial<{ title: string; remindAt: string; isCompleted: boolean }>,
) => {
  await reminderRepository.update(id, input);
  return reminderRepository.getById(id, userId);
};

export const deleteReminder = async (userId: string, id: string) =>
  reminderRepository.delete(id, userId);
