import db from "../../../config/db";
import { randomUUID } from "crypto";

export const conversationRepository = {
  async create(userId: string, title?: string) {
    const id = randomUUID();
    const conversation = { id, user_id: userId, title: title?.trim() || "New conversation" };
    await db("conversations").insert(conversation);
    return conversation;
  },

  async list(userId: string) {
    return db("conversations").where({ user_id: userId }).orderBy("created_at", "desc");
  },

  async getById(id: string, userId: string) {
    return db("conversations").where({ id, user_id: userId }).first();
  },

  async updateTitle(id: string, title: string) {
    await db("conversations").where({ id }).update({ title });
  },
};

export const messageRepository = {
  async create(conversationId: string, sender: "user" | "ai", message: string, emotionTag: string) {
    const id = randomUUID();
    const msg = { id, conversation_id: conversationId, sender, message, emotion_tag: emotionTag };
    await db("messages").insert(msg);
    return msg;
  },

  async listByConversation(conversationId: string) {
    return db("messages").where({ conversation_id: conversationId }).orderBy("created_at", "asc");
  },
};

export const moodRepository = {
  async create(userId: string, mood: string, note?: string) {
    const id = randomUUID();
    const moodData = { id, user_id: userId, mood, note: note || null };
    await db("moods").insert(moodData);
    return moodData;
  },

  async list(userId: string) {
    return db("moods").where({ user_id: userId }).orderBy("created_at", "desc");
  },

  async getAnalytics(userId: string) {
    const moods = await this.list(userId);
    const totals = await db("moods").where({ user_id: userId }).select("mood").count("* as count").groupBy("mood");

    return {
      totalEntries: moods.length,
      latestMood: moods[0]?.mood || null,
      distribution: totals,
    };
  },
};

export const journalRepository = {
  async create(userId: string, title: string, content: string, mood: string) {
    const id = randomUUID();
    const journal = { id, user_id: userId, title, content, mood };
    await db("journals").insert(journal);
    return journal;
  },

  async list(userId: string) {
    return db("journals").where({ user_id: userId }).orderBy("created_at", "desc");
  },

  async getById(id: string, userId: string) {
    return db("journals").where({ id, user_id: userId }).first();
  },

  async update(id: string, data: Partial<{ title: string; content: string; mood: string }>) {
    await db("journals").where({ id }).update(data);
  },

  async delete(id: string, userId: string) {
    await db("journals").where({ id, user_id: userId }).del();
  },
};

export const reminderRepository = {
  async create(userId: string, title: string, remindAt: string) {
    const id = randomUUID();
    const reminder = { id, user_id: userId, title, remind_at: remindAt, is_completed: false };
    await db("reminders").insert(reminder);
    return reminder;
  },

  async list(userId: string) {
    return db("reminders").where({ user_id: userId }).orderBy("created_at", "desc");
  },

  async getById(id: string, userId: string) {
    return db("reminders").where({ id, user_id: userId }).first();
  },

  async update(id: string, data: Partial<{ title: string; remind_at: string; is_completed: boolean }>) {
    await db("reminders").where({ id }).update(data);
  },

  async delete(id: string, userId: string) {
    await db("reminders").where({ id, user_id: userId }).del();
  },
};

export const aiProfileRepository = {
  async getOrCreate(userId: string) {
    let profile = await db("ai_profiles").where({ user_id: userId }).first();

    if (!profile) {
      const id = randomUUID();
      const newProfile = {
        id,
        user_id: userId,
        tone: "friendly",
        personality: "Warm, patient, practical, and context-aware.",
      };
      await db("ai_profiles").insert(newProfile);
      profile = newProfile;
    }

    return profile;
  },

  async update(userId: string, data: { tone?: string; personality?: string }) {
    await db("ai_profiles").where({ user_id: userId }).update(data);
    return this.getOrCreate(userId);
  },
};

export const emergencyContactRepository = {
  async create(userId: string, name: string, phone: string, relation: string) {
    const id = randomUUID();
    const contact = { id, user_id: userId, name, phone, relation };
    await db("emergency_contacts").insert(contact);
    return contact;
  },

  async list(userId: string) {
    return db("emergency_contacts").where({ user_id: userId }).orderBy("created_at", "desc");
  },

  async getById(id: string, userId: string) {
    return db("emergency_contacts").where({ id, user_id: userId }).first();
  },

  async update(id: string, data: Partial<{ name: string; phone: string; relation: string }>) {
    await db("emergency_contacts").where({ id }).update(data);
  },

  async delete(id: string, userId: string) {
    await db("emergency_contacts").where({ id, user_id: userId }).del();
  },
};
