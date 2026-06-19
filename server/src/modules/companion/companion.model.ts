export type MoodTag =
  | "happy"
  | "sad"
  | "stressed"
  | "anxious"
  | "calm"
  | "hopeful"
  | "neutral";

export type Sender = "user" | "ai";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: Sender;
  message: string;
  emotionTag: MoodTag;
  createdAt: string;
}

export interface Mood {
  id: string;
  userId: string;
  mood: MoodTag;
  note?: string;
  createdAt: string;
}

export interface Journal {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: MoodTag;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  remindAt: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface AIProfile {
  id: string;
  userId: string;
  tone: string;
  personality: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relation: string;
  createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;
