import { z } from "zod";

export const moodSchema = z.enum([
  "happy",
  "sad",
  "stressed",
  "anxious",
  "calm",
  "hopeful",
  "neutral",
]);
