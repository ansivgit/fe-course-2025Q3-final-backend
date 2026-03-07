import type { Task } from '../types/ai';
import { ChatRequestSchema, TasksArraySchema, type ChatRequestParams } from '../schemas/chatRequest';
import type { SchemaValidationResult } from '../types/error.types';
import { type ZodType, z } from 'zod';
import { DatabaseError } from '../errors';
import type { WidgetValidation } from '../schemas/widget';

// An auxiliary function that verifies that the value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const validateChatRequest = (data: unknown): SchemaValidationResult<ChatRequestParams> => {
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

export const validateTasksData = (data: unknown): SchemaValidationResult<Task[]> => {
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

// Validation of widget data
export function validateWidgets<T>(data: unknown, schema: ZodType<T>): WidgetValidation<T> {
  const result: z.ZodSafeParseResult<T[]> = z.array(schema).safeParse(data);

  if (!result.success) {
    throw new DatabaseError(
      result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
    );
  }

  return result.data;
}
