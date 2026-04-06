import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Field "message" is required'),
  topic: z.string().min(1, 'Field "topic" is required'),
  difficulty: z.enum(['junior', 'middle', 'senior']),
  sessionId: z.string().min(1, 'Field "sessionId" is required'),
});

export type ChatRequestParams = z.infer<typeof ChatRequestSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  topic: z.string(),
  difficulty: z.enum(['junior', 'middle', 'senior']),
  question: z.string(),
  goldenAnswer: z.string(),
  rubric: z.array(z.string()),
});

export const TasksArraySchema = z.array(TaskSchema);
