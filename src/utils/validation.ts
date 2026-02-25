import type { ChatRequestBody } from '../types/ai';

type ValidationResult = {
  data: ChatRequestBody | null;
  error: string | null;
};

// An auxiliary function that verifies that the value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const validateChatRequest = (body: unknown): ValidationResult => {
  if (!isObject(body)) {
    return { data: null, error: 'Request body must be a JSON object' };
  }

  const { message, topic, difficulty, sessionId } = body;

  if (typeof message !== 'string' || !message.trim()) {
    return { data: null, error: 'Field "message" is required and must be a string' };
  }

  if (topic !== undefined && typeof topic !== 'string') {
    return { data: null, error: 'Field "topic" must be a string' };
  }

  if (
    difficulty !== undefined &&
    difficulty !== 'junior' &&
    difficulty !== 'middle' &&
    difficulty !== 'senior'
  ) {
    return { data: null, error: 'Field "difficulty" must be junior, middle, or senior' };
  }

  if (sessionId !== undefined && typeof sessionId !== 'string') {
    return { data: null, error: 'Field "sessionId" must be a string' };
  }

  return {
    data: {
      message,
      topic,
      difficulty,
      sessionId,
    },
    error: null,
  };
};
