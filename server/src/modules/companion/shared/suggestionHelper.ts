import { moodRepository } from "./repository";

type MoodTag = "happy" | "sad" | "stressed" | "anxious" | "calm" | "hopeful" | "neutral";

export const getSuggestions = async (userId: string) => {
  const analytics = await moodRepository.getAnalytics(userId);
  const latestMood = (analytics.latestMood ?? "neutral") as MoodTag;

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
    basedOn: latestMood,
    suggestions: suggestions[latestMood],
  };
};
