import { getAIProfile } from "../ai-profile/ai-profile.service";

type MoodTag = "happy" | "sad" | "stressed" | "anxious" | "calm" | "hopeful" | "neutral";

export const detectEmotion = (text: string): MoodTag => {
  const lower = text.toLowerCase();

  if (/(panic|anxious|worry|afraid|scared|fear)/.test(lower)) return "anxious";
  if (/(stress|stressed|overwhelm|pressure|burnout|tired)/.test(lower)) return "stressed";
  if (/(sad|low|empty|alone|hopeless|cry)/.test(lower)) return "sad";
  if (/(happy|great|excited|joy|good)/.test(lower)) return "happy";
  if (/(hope|better|grateful|progress)/.test(lower)) return "hopeful";
  if (/(calm|peace|steady|relaxed)/.test(lower)) return "calm";

  return "neutral";
};

export const createAIResponse = async (userId: string, emotion: MoodTag, userMessage: string) => {
  const profile = await getAIProfile(userId);
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
