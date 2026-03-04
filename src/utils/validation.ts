import { z } from 'zod';
import type { Task, ValidationResult } from '../types/ai';

// An auxiliary function that verifies that the value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

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

export const validateChatRequest = (data: unknown): ValidationResult<ChatRequestParams> => {
  const parsed = ChatRequestSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((er) => er.message).join(', '),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};

export const validateTasksData = (data: unknown): ValidationResult<Task[]> => {
  const parsed = TasksArraySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((er) => er.message).join(', '),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};
