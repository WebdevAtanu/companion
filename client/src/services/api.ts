import { api } from '../lib/api'

// Types
export type Mood = 'calm' | 'hopeful' | 'low' | 'anxious' | 'stressed' | 'happy' | 'sad' | 'neutral'

export interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  tag?: Mood
  time: string
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  mood: Mood
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  title: string
  remindAt: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface MoodEntry {
  id: string
  mood: Mood
  note?: string
  createdAt: string
}

export interface AIProfile {
  id: string
  tone: string
  personality: string
  userId: string
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
  userId: string
}

// Auth API
export const authApi = {
  async login(email: string, password: string) {
    return api.post<{ token: string; user: { id: string; email: string } }>('/auth/login', {
      email,
      password,
    })
  },

  async register(email: string, password: string, name?: string) {
    return api.post<{ token: string; user: { id: string; email: string } }>('/auth/register', {
      email,
      password,
      name,
    })
  },

  async getMe() {
    return api.get<{ id: string; email: string; name?: string }>('/auth/me')
  },
}

// Conversations API
export const conversationsApi = {
  async list() {
    return api.get<Conversation[]>('/conversations')
  },

  async create(title?: string) {
    return api.post<Conversation>('/conversations', { title })
  },

  async get(id: string) {
    return api.get<Conversation>(`/conversations/${id}`)
  },

  async addMessage(conversationId: string, message: string) {
    return api.post<{ conversation: Conversation; aiResponse: Message }>(
      `/conversations/${conversationId}/messages`,
      { message },
    )
  },
}

// Moods API
export const moodsApi = {
  async list() {
    return api.get<MoodEntry[]>('/moods')
  },

  async create(mood: Mood, note?: string) {
    return api.post<MoodEntry>('/moods', { mood, note })
  },

  async getAnalytics() {
    return api.get<{ mood: Mood; count: number }[]>('/moods/analytics')
  },
}

// Journals API
export const journalsApi = {
  async list() {
    return api.get<JournalEntry[]>('/journals')
  },

  async create(data: { title: string; content: string; mood: Mood }) {
    return api.post<JournalEntry>('/journals', data)
  },

  async get(id: string) {
    return api.get<JournalEntry>(`/journals/${id}`)
  },

  async update(id: string, data: Partial<{ title: string; content: string; mood: Mood }>) {
    return api.put<JournalEntry>(`/journals/${id}`, data)
  },

  async delete(id: string) {
    return api.delete<void>(`/journals/${id}`)
  },
}

// Reminders API
export const remindersApi = {
  async list() {
    return api.get<Reminder[]>('/reminders')
  },

  async create(data: { title: string; remindAt: string }) {
    return api.post<Reminder>('/reminders', data)
  },

  async update(id: string, data: Partial<{ title: string; remindAt: string; isCompleted: boolean }>) {
    return api.put<Reminder>(`/reminders/${id}`, data)
  },

  async delete(id: string) {
    return api.delete<void>(`/reminders/${id}`)
  },
}

// AI Profile API
export const aiProfileApi = {
  async get() {
    return api.get<AIProfile>('/ai-profile')
  },

  async update(data: Partial<{ tone: string; personality: string }>) {
    return api.put<AIProfile>('/ai-profile', data)
  },
}

// Emergency Contacts API
export const emergencyContactsApi = {
  async list() {
    return api.get<EmergencyContact[]>('/emergency-contacts')
  },

  async create(data: { name: string; phone: string; relation: string }) {
    return api.post<EmergencyContact>('/emergency-contacts', data)
  },

  async update(id: string, data: Partial<{ name: string; phone: string; relation: string }>) {
    return api.put<EmergencyContact>(`/emergency-contacts/${id}`, data)
  },

  async delete(id: string) {
    return api.delete<void>(`/emergency-contacts/${id}`)
  },
}

// Suggestions API
export const suggestionsApi = {
  async get() {
    return api.get<string[]>('/suggestions')
  },
}
