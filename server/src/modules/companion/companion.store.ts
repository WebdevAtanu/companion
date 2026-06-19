import {
  AIProfile,
  Conversation,
  EmergencyContact,
  Journal,
  Message,
  Mood,
  Reminder,
  User,
} from "./companion.model";

export const store = {
  users: new Map<string, User>(),
  usersByEmail: new Map<string, string>(),
  conversations: new Map<string, Conversation>(),
  messages: new Map<string, Message[]>(),
  moods: new Map<string, Mood>(),
  journals: new Map<string, Journal>(),
  reminders: new Map<string, Reminder>(),
  aiProfiles: new Map<string, AIProfile>(),
  emergencyContacts: new Map<string, EmergencyContact>(),
};

export const now = () => new Date().toISOString();

export const byUser = <T extends { userId: string; createdAt?: string }>(
  records: Iterable<T>,
  userId: string,
) =>
  Array.from(records)
    .filter((record) => record.userId === userId)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
