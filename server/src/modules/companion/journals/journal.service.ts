import { journalRepository } from "../shared/repository";

export const listJournals = async (userId: string) =>
  journalRepository.list(userId);

export const createJournal = async (
  userId: string,
  input: { title: string; content: string; mood: string },
) =>
  journalRepository.create(userId, input.title, input.content, input.mood);

export const getJournal = async (userId: string, id: string) => {
  const journal = await journalRepository.getById(id, userId);
  if (!journal) {
    throw new Error("Journal not found");
  }
  return journal;
};

export const updateJournal = async (
  userId: string,
  id: string,
  input: Partial<{ title: string; content: string; mood: string }>,
) => {
  await journalRepository.update(id, input);
  return journalRepository.getById(id, userId);
};

export const deleteJournal = async (userId: string, id: string) =>
  journalRepository.delete(id, userId);
