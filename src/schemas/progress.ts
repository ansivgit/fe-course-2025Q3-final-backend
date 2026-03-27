import { z } from 'zod';

export const ProgressSchema = z.object({
  userId: z.string(),
  userAchievements: z.string().array(),
  updatedAt: z.number(),

  progress: z.object({
    javascript: z.number(),
    typescript: z.number(),
    react: z.number(),
    nodejs: z.number(),
  }),

  solvedWidgets: z.object({
    quiz: z.string().array(),
    matchGame: z.string().array(),
  }),
});
