import { DIFFICULTIES, TOPICS } from '../constants/dictionaries';
import type { ChatRequestBody, Difficulty } from '../types/ai';

type ValidationResult = {
  data: ChatRequestBody | null;
  error: string | null;
};

// An auxiliary function that verifies that the value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Checks that the string is of acceptable difficulty level
function isValidDifficulty(value: string): value is Difficulty {
  return DIFFICULTIES.some((item) => item.id === value);
}

// Checks that the string is a valid topic.
function isValidTopic(value: string): boolean {
  return TOPICS.some((item) => item.id === value);
}

export const validateChatRequest = (body: unknown): ValidationResult => {
  if (!isObject(body)) {
    return { data: null, error: 'Request body must be a JSON object' };
  }

  const { message, topic, difficulty, sessionId } = body;

  // Validation of fields
  if (typeof message !== 'string' || !message.trim()) {
    return { data: null, error: 'Field "message" is required and must be a string' };
  }

  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return { data: null, error: 'Field "sessionId" is required' };
  }

  if (typeof topic !== 'string' || !isValidTopic(topic)) {
    // We collect available topics for suggestions in the error
    const allowed = TOPICS.map((t) => t.id).join(', ');
    return { data: null, error: `Invalid or missing "topic". Allowed: ${allowed}` };
  }

  if (typeof difficulty !== 'string' || !isValidDifficulty(difficulty)) {
    const allowed = DIFFICULTIES.map((d) => d.id).join(', ');
    return { data: null, error: `Invalid or missing "difficulty". Allowed: ${allowed}` };
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
