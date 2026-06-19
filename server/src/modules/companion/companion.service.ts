import { randomUUID } from "crypto";
import {
  AIProfile,
  Conversation,
  EmergencyContact,
  Journal,
  Message,
  Mood,
  MoodTag,
  Reminder,
} from "./companion.model";
import { byUser, now, store } from "./companion.store";

const validMoods: MoodTag[] = [
  "happy",
  "sad",
  "stressed",
  "anxious",
  "calm",
  "hopeful",
  "neutral",
];

export const detectEmotion = (text: string): MoodTag => {
  const lower = text.toLowerCase();

  if (/(panic|anxious|worry|afraid|scared|fear)/.test(lower)) {
    return "anxious";
  }

  if (/(stress|stressed|overwhelm|pressure|burnout|tired)/.test(lower)) {
    return "stressed";
  }

  if (/(sad|low|empty|alone|hopeless|cry)/.test(lower)) {
    return "sad";
  }

  if (/(happy|great|excited|joy|good)/.test(lower)) {
    return "happy";
  }

  if (/(hope|better|grateful|progress)/.test(lower)) {
    return "hopeful";
  }

  if (/(calm|peace|steady|relaxed)/.test(lower)) {
    return "calm";
  }

  return "neutral";
};

const createAIResponse = (
  userId: string,
  emotion: MoodTag,
  userMessage: string,
) => {
  const profile = getAIProfile(userId);
  const opener = profile.tone.toLowerCase().includes("direct")
    ? "Here is a small next step."
    : "I am here with you.";

  const responses: Record<MoodTag, string> = {
    happy: `${opener} Let us notice what is working and choose one way to protect that momentum.`,
    sad: `${opener} This sounds heavy. Try naming one need first, then one person or action that could support it.`,
    stressed: `${opener} We can lower the load by picking the smallest useful action from this: "${userMessage.slice(0, 80)}".`,
    anxious: `${opener} Take one slower breath, then list five things you can see before we decide what needs action.`,
    calm: `${opener} This is a good moment to check what helped you feel steadier and make it repeatable.`,
    hopeful: `${opener} There is some forward motion here. Let us turn it into one concrete plan for today.`,
    neutral: `${opener} Tell me what part matters most, and I will help you sort it into something manageable.`,
  };

  return responses[emotion];
};

const requireConversation = (userId: string, conversationId: string) => {
  const conversation = store.conversations.get(conversationId);

  if (!conversation || conversation.userId !== userId) {
    throw new Error("Conversation not found");
  }

  return conversation;
};

const requireJournal = (userId: string, id: string) => {
  const journal = store.journals.get(id);

  if (!journal || journal.userId !== userId) {
    throw new Error("Journal not found");
  }

  return journal;
};

const requireReminder = (userId: string, id: string) => {
  const reminder = store.reminders.get(id);

  if (!reminder || reminder.userId !== userId) {
    throw new Error("Reminder not found");
  }

  return reminder;
};

const requireContact = (userId: string, id: string) => {
  const contact = store.emergencyContacts.get(id);

  if (!contact || contact.userId !== userId) {
    throw new Error("Emergency contact not found");
  }

  return contact;
};

export const listConversations = (userId: string) =>
  byUser(store.conversations.values(), userId);

export const createConversation = (userId: string, title?: string) => {
  const conversation: Conversation = {
    id: randomUUID(),
    userId,
    title: title?.trim() || "New conversation",
    createdAt: now(),
  };

  store.conversations.set(conversation.id, conversation);
  store.messages.set(conversation.id, []);

  return conversation;
};

export const getConversation = (userId: string, conversationId: string) => {
  const conversation = requireConversation(userId, conversationId);

  return {
    ...conversation,
    messages: store.messages.get(conversation.id) ?? [],
  };
};

export const addMessage = (
  userId: string,
  conversationId: string,
  messageText: string,
) => {
  const conversation = requireConversation(userId, conversationId);
  const emotionTag = detectEmotion(messageText);
  const createdAt = now();
  const userMessage: Message = {
    id: randomUUID(),
    conversationId: conversation.id,
    sender: "user",
    message: messageText,
    emotionTag,
    createdAt,
  };
  const aiMessage: Message = {
    id: randomUUID(),
    conversationId: conversation.id,
    sender: "ai",
    message: createAIResponse(userId, emotionTag, messageText),
    emotionTag,
    createdAt: now(),
  };
  const messages = store.messages.get(conversation.id) ?? [];

  messages.push(userMessage, aiMessage);
  store.messages.set(conversation.id, messages);

  if (conversation.title === "New conversation") {
    conversation.title = messageText.slice(0, 60);
    store.conversations.set(conversation.id, conversation);
  }

  return {
    conversation,
    messages: [userMessage, aiMessage],
  };
};

export const listMoods = (userId: string) => byUser(store.moods.values(), userId);

export const createMood = (
  userId: string,
  input: { mood: MoodTag; note?: string },
) => {
  const mood: Mood = {
    id: randomUUID(),
    userId,
    mood: input.mood,
    createdAt: now(),
    ...(input.note ? { note: input.note } : {}),
  };

  store.moods.set(mood.id, mood);
  return mood;
};

export const getMoodAnalytics = (userId: string) => {
  const moods = listMoods(userId);
  const totals = validMoods.map((mood) => ({
    mood,
    count: moods.filter((entry) => entry.mood === mood).length,
  }));
  const latest = moods[0];

  return {
    totalEntries: moods.length,
    latestMood: latest?.mood ?? null,
    distribution: totals,
  };
};

export const listJournals = (userId: string) =>
  byUser(store.journals.values(), userId);

export const createJournal = (
  userId: string,
  input: { title: string; content: string; mood: MoodTag },
) => {
  const createdAt = now();
  const journal: Journal = {
    id: randomUUID(),
    userId,
    title: input.title,
    content: input.content,
    mood: input.mood,
    createdAt,
    updatedAt: createdAt,
  };

  store.journals.set(journal.id, journal);
  return journal;
};

export const getJournal = (userId: string, id: string) => requireJournal(userId, id);

export const updateJournal = (
  userId: string,
  id: string,
  input: Partial<Pick<Journal, "title" | "content" | "mood">>,
) => {
  const journal = requireJournal(userId, id);
  const updated: Journal = {
    ...journal,
    ...input,
    updatedAt: now(),
  };

  store.journals.set(id, updated);
  return updated;
};

export const deleteJournal = (userId: string, id: string) => {
  requireJournal(userId, id);
  store.journals.delete(id);
};

export const listReminders = (userId: string) =>
  byUser(store.reminders.values(), userId);

export const createReminder = (
  userId: string,
  input: { title: string; remindAt: string },
) => {
  const reminder: Reminder = {
    id: randomUUID(),
    userId,
    title: input.title,
    remindAt: input.remindAt,
    isCompleted: false,
    createdAt: now(),
  };

  store.reminders.set(reminder.id, reminder);
  return reminder;
};

export const updateReminder = (
  userId: string,
  id: string,
  input: Partial<Pick<Reminder, "title" | "remindAt" | "isCompleted">>,
) => {
  const reminder = requireReminder(userId, id);
  const updated: Reminder = { ...reminder, ...input };

  store.reminders.set(id, updated);
  return updated;
};

export const deleteReminder = (userId: string, id: string) => {
  requireReminder(userId, id);
  store.reminders.delete(id);
};

export const getAIProfile = (userId: string) => {
  const existing = Array.from(store.aiProfiles.values()).find(
    (profile) => profile.userId === userId,
  );

  if (existing) {
    return existing;
  }

  const createdAt = now();
  const profile: AIProfile = {
    id: randomUUID(),
    userId,
    tone: "friendly",
    personality: "Warm, patient, practical, and context-aware.",
    createdAt,
    updatedAt: createdAt,
  };

  store.aiProfiles.set(profile.id, profile);
  return profile;
};

export const updateAIProfile = (
  userId: string,
  input: Partial<Pick<AIProfile, "tone" | "personality">>,
) => {
  const profile = getAIProfile(userId);
  const updated: AIProfile = { ...profile, ...input, updatedAt: now() };

  store.aiProfiles.set(profile.id, updated);
  return updated;
};

export const listEmergencyContacts = (userId: string) =>
  byUser(store.emergencyContacts.values(), userId);

export const createEmergencyContact = (
  userId: string,
  input: { name: string; phone: string; relation: string },
) => {
  const contact: EmergencyContact = {
    id: randomUUID(),
    userId,
    name: input.name,
    phone: input.phone,
    relation: input.relation,
    createdAt: now(),
  };

  store.emergencyContacts.set(contact.id, contact);
  return contact;
};

export const updateEmergencyContact = (
  userId: string,
  id: string,
  input: Partial<Pick<EmergencyContact, "name" | "phone" | "relation">>,
) => {
  const contact = requireContact(userId, id);
  const updated: EmergencyContact = { ...contact, ...input };

  store.emergencyContacts.set(id, updated);
  return updated;
};

export const deleteEmergencyContact = (userId: string, id: string) => {
  requireContact(userId, id);
  store.emergencyContacts.delete(id);
};

export const getSuggestions = (userId: string) => {
  const latestMood = getMoodAnalytics(userId).latestMood;

  const suggestions: Record<MoodTag, string[]> = {
    happy: ["Write down what worked", "Share the win with someone safe"],
    sad: ["Drink water", "Send one honest message to a trusted contact"],
    stressed: ["Choose one task to postpone", "Do a two-minute breathing reset"],
    anxious: ["Try 5-4-3-2-1 grounding", "Move one worry into a written plan"],
    calm: ["Save this routine", "Schedule a short check-in for later"],
    hopeful: ["Turn the next step into a reminder", "Journal what changed"],
    neutral: ["Start a quick mood check-in", "Name one thing that needs attention"],
  };

  return {
    basedOn: latestMood ?? "neutral",
    suggestions: suggestions[latestMood ?? "neutral"],
  };
};
