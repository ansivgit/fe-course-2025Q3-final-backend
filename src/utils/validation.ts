import type { Task } from '../types/ai';
import { ChatRequestSchema, TasksArraySchema, type ChatRequestParams } from '../schemas/chatRequest';
import type { ValidationResult } from '../types/error.types';

// An auxiliary function that verifies that the value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

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
